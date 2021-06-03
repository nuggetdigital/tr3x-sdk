import {SUPPORTED_CHAINS, evmChainIdToName, VALID_MIME_TYPES} from "./constants.js"

function validateExclusiveParams(params, onlyForLicenseText) {
  if (!SUPPORTED_CHAINS.has(params.evmChainId)) {
    throw TypeError(`chain must be one of ${[...SUPPORTED_CHAINS].join(", ")}`)
  }
  if (typeof params.artist !== "string" || !params.artist.length) {
    throw TypeError("artist must be a string")
  }
  if (typeof params.title !== "string" || !params.title.length) {
    throw TypeError("title must be a string")
  }
  if (typeof params.price !== "bigint" || !(params.price > 0n)) {
    throw TypeError("price must be a bigint gt 0")
  }
  if (!/^(0x)?[a-f0-9]{64}$/.test(params.blake3256)) {
    throw TypeError("blake3256 must be a hex string")
  }
  if (!/^[0-9]{4}$/.test(params.copyrightYear?.toString())) {
    throw TypeError("copyrightYear must be intlike")
  }
  if (!/^(0x)?[0-9a-fA-F]{40}$/.test(params.payee)) {
    throw TypeError("payee must match the ethereum address format")
  }
  if (!onlyForLicenseText) {
    if (!/^[a-z2-7]{32,}$/.test(params.cid) ) {
      throw TypeError("invalid cidv1")
    }
    if (!VALID_MIME_TYPES.has(params.mime)) {
      throw TypeError("invalid mime")
    }
  }
}

function validateLeaseParams(params, onlyForLicenseText) {
  if (!SUPPORTED_CHAINS.has(params.evmChainId)) {
    throw TypeError(`chain must be one of ${[...SUPPORTED_CHAINS].join(", ")}`)
  }
  if (typeof params.artist !== "string" || !params.artist.length) {
    throw TypeError("artist must be a string")
  }
  if (typeof params.title !== "string" || !params.title.length) {
    throw TypeError("title must be a string")
  }
  if (typeof params.price !== "bigint" || !(params.price > 0n)) {
    throw TypeError("price must be a bigint gt 0")
  }
  if (!/^(0x)?[a-f0-9]{64}$/.test(params.blake3256)) {
    throw TypeError("blake3256 must be a hex string")
  }
  if (!/^[0-9]{4}$/.test(params.copyrightYear?.toString())) {
    throw TypeError("copyrightYear must be intlike")
  }
  if (!/^(0x)?[0-9a-fA-F]{40}$/.test(params.payee)) {
    throw TypeError("payee must match the ethereum address format")
  }
  if (typeof params.term !== "bigint" || !(params.term > 0n)) {
    throw TypeError("term must be a bigint gt 0")
  }
  if (typeof params.cap !== "bigint" || !(params.cap > 0n)) {
    throw TypeError("cap must be a bigint gt 0")
  }
  if (
    typeof params.paybackRateEURTR3X !== "number" ||
    !(params.paybackRateEURTR3X > 0)
  ) {
    throw TypeError("paybackRateEURTR3X must be a float gt 0")
  }
  if (!onlyForLicenseText) {
    if (!/^[a-z2-7]{32,}$/.test(params.cid)) {
      throw TypeError("invalid cidv1")
    }
    if (!VALID_MIME_TYPES.has(params.mime)) {
      throw TypeError("invalid mime")
    }
  }
}

export const licenseText = {
  lease(params, validate = true) {
    if (validate) {
      validateLeaseParams(params, true)
    }
    return `
tr3x public performance lease license

Permission is hereby granted, at a charge of ${params.price}STYC (TR3X), payable to ${evmChainIdToName[params.evmChainId]} chain address ${params.payee}, to any person purchasing a token of this digital license asset to perform the associated track named "${params.title}", © ${params.copyrightYear} ${params.artist}, identified by its BLAKE3 256-bit hash digest 0x${params.blake3256}, in public, for a lease term of ${params.term} finalized blocks on the ${evmChainIdToName[params.evmChainId]} chain, starting with the block number that the purchase transaction acquiring this license got finalized in.

Maximum profits off of public performances of the lessee must not excceed ${params.cap}€, otherwise the lessee must monthly payback 50% of the excess profits to above payee via the marketplace in TR3X at the EUR/TR3X payback rate of ${params.paybackRateEURTR3X}.

The artist name "${params.artist}" must be visibly included in all digital and physical copies and noticeably mentioned at any public performances explicitely accrediting ${params.artist} as the creator of "${params.title}".

Claims of this license must be prooved using tr3x purchase transactions on the ${evmChainIdToName[params.evmChainId]} chain.
`.trim()
  },
  exclusive(params, validate = true) {
    if (validate) {
      validateExclusiveParams(params, true)
    }
    return `
tr3x public performance exclusive license

Permission is hereby granted, at a charge of ${params.price}STYC (TR3X), payable to ${evmChainIdToName[params.evmChainId]} chain address ${params.payee}, to the first person purchasing a token of this digital license asset to exclusively perform the associated track named "${params.title}", © ${params.copyrightYear} ${params.artist}, identified by its BLAKE3 256-bit hash digest 0x${params.blake3256}, in public.

The artist name "${params.artist}" must be visibly included in all digital and physical copies and noticeably mentioned at any public performances explicitely accrediting ${params.artist} as the creator of "${params.title}".

Claims of this particular license must be verified against their respective purchases on the ${evmChainIdToName[params.evmChainId]} chain.
`.trim()
  }
}

const encoder = new TextEncoder()
const decoder = new TextDecoder()

export default {
  serialize(metadata) {
    return encoder.encode(JSON.stringify(metadata))
  },
  deserialize(buf) {
    return JSON.parse(decoder.decode(buf))
  },
  exclusive(params) {
    validateExclusiveParams(params)

    const {
      artist,
      title,
      price,
      blake3256,
      copyrightYear,
      mime,
      cid,
      evmChainId,
      payee
    } = params

    return {
      artist,
      title,
      // IPFS content identifier of the track
      cid,
      // BLAKE3 256-bit hash digest of the track
      blake3256: blake3256.startsWith("0x") ? blake3256 : "0x" + blake3256,
      // content type for convenience, extendability & browsers
      mime,
      // minimum STYC price
      price: price.toString() + "STYC",
      // 4 now just a moonbeam address
      payee,
      evmChainId,
      copyrightYear,
      license: licenseText.exclusive(params, false)
    }
  },
  lease(params) {
    validateLeaseParams(params)

    const {
      artist,
      title,
      price,
      blake3256,
      copyrightYear,
      mime,
      cid,
      evmChainId,
      payee,
      term,
      cap,
      paybackRateEURTR3X
    } = params

    return {
      artist,
      title,
      // IPFS content identifier of the track
      cid,
      // BLAKE3 256-bit hash digest of the track
      blake3256: blake3256.startsWith("0x") ? blake3256 : "0x" + blake3256,
      // content type for convenience, extendability & browsers
      mime,
      // minimum STYC price
      price: price.toString() + "STYC",
      // 4 now just a moonbeam address
      payee,
      // payback exchange rate for lease violations
      paybackRateEURTR3X,
      // ~lease validity period - expiry date expressed as finalized block count
      term: term.toString() + " finalized blocks",
      // maximum permitted EUR profits from public performances
      cap: cap.toString() + "€",
      evmChainId,
      copyrightYear,
      license: licenseText.lease(params, false)
    }
  }
}
