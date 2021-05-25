const VALID_MIME_TYPES = new Set([
  "audio/wav",
  "audio/mpeg",
  "audio/mp3",
  "application/octet-stream"
])

const VALID_NETWORKS = new Set([
  "Homestead",
  "Ropsten",
  "Moonbeam",
  "Moonriver"
])

export default {
  exclusive({
    artist,
    title,
    price,
    blake3256,
    copyrightYear,
    mime,
    cid,
    network,
    payee
  }) {
    if (!VALID_NETWORKS.has(network)) {
      throw TypeError(
        `network must be one of ${[...VALID_NETWORKS].join(", ")}`
      )
    }
    if (typeof artist !== "string" || !artist.length) {
      throw TypeError("artist must be a string")
    }
    if (typeof title !== "string" || !title.length) {
      throw TypeError("title must be a string")
    }
    if (typeof price !== "bigint" || !(price > 0n)) {
      throw TypeError("price must be a bigint gt 0")
    }
    if (!/^[a-f0-9]{64}$/.test(blake3256)) {
      throw TypeError("blake3256 must be a hex string")
    }
    if (!/^[0-9]{4}$/.test(copyrightYear?.toString())) {
      throw TypeError("copyrightYear must be intlike")
    }
    if (!/^[a-z2-7]+=*$/.test(cid) || cid.length !== 46) {
      throw TypeError("invalid cidv1")
    }
    if (!VALID_MIME_TYPES.has(mime)) {
      throw TypeError("invalid mime")
    }
    if (!/^(0x)?[0-9a-fA-F]{40}$/.test(payee)) {
      throw TypeError("payee must match the ethereum address format")
    }
    return {
      artist,
      title,
      // IPFS content identifier of the track
      cid,
      // BLAKE3 256-bit hash digest of the track
      blake3256,
      // content type for convenience, extendability & browsers
      mime,
      // minimum STYC price
      price: price.toString() + "STYC",
      // 4 now just a moonbeam address
      payee,
      network,
      copyrightYear,
      license: `
tr3x public performance exclusive license

Permission is hereby granted, at a charge of ${price}STYC (TR3X), payable to ${network} network address ${payee}, to the first person purchasing a token of this digital license asset to exclusively perform the associated track named "${title}", © ${copyrightYear} ${artist}, identified by its BLAKE3 256-bit hash digest 0x${blake3256}, in public.

The artist name "${artist}" must be visibly included in all digital and physical copies and noticeably mentioned at any public performances explicitely accrediting ${artist} as the creator of "${title}".

Claims of this particular license must be verified against their respective purchases on the ${network} network.
`.trim()
    }
  },
  lease({
    artist,
    title,
    price,
    blake3256,
    copyrightYear,
    mime,
    cid,
    network,
    payee,
    term,
    cap,
    paybackRateEURTR3X
  }) {
    if (!VALID_NETWORKS.has(network)) {
      throw TypeError(
        `network must be one of ${[...VALID_NETWORKS].join(", ")}`
      )
    }
    if (typeof artist !== "string" || !artist.length) {
      throw TypeError("artist must be a string")
    }
    if (typeof title !== "string" || !title.length) {
      throw TypeError("title must be a string")
    }
    if (typeof price !== "bigint" || !(price > 0n)) {
      throw TypeError("price must be a bigint gt 0")
    }
    if (!/^[a-f0-9]{64}$/.test(blake3256)) {
      throw TypeError("blake3256 must be a hex string")
    }
    if (!/^[0-9]{4}$/.test(copyrightYear?.toString())) {
      throw TypeError("copyrightYear must be intlike")
    }
    if (!/^[a-z2-7]+=*$/.test(cid) || cid.length !== 46) {
      throw TypeError("invalid cidv1")
    }
    if (!VALID_MIME_TYPES.has(mime)) {
      throw TypeError("invalid mime")
    }
    if (!/^(0x)?[0-9a-fA-F]{40}$/.test(payee)) {
      throw TypeError("payee must match the ethereum address format")
    }
    if (typeof term !== "bigint" || !(term > 0n)) {
      throw TypeError("term must be a bigint gt 0")
    }
    if (typeof cap !== "bigint" || !(cap > 0n)) {
      throw TypeError("cap must be a bigint gt 0")
    }
    if (typeof paybackRateEURTR3X !== "number" || !(paybackRateEURTR3X > 0)) {
      throw TypeError("paybackRateEURTR3X must be a float gt 0")
    }
    return {
      artist,
      title,
      // IPFS content identifier of the track
      cid,
      // BLAKE3 256-bit hash digest of the track
      blake3256,
      // content type for convenience, extendability & browsers
      mime,
      // minimum STYC price
      price: price.toString() + "STYC",
      // 4 now just a moonbeam address
      payee,
      // payback exchange rate for lease violations
      paybackRateEURTR3X,
      // ~lease validity period - expiry date expressed as finalized block count
      term: network + " " + term.toString(),
      // maximum permitted EUR profits from public performances
      cap: cap.toString() + "€",
      network,
      copyrightYear,
      license: `
tr3x public performance lease license

Permission is hereby granted, at a charge of ${price}STYC (TR3X), payable to ${network} network address ${payee}, to any person purchasing a token of this digital license asset to perform the associated track named "${title}", © ${copyrightYear} ${artist}, identified by its BLAKE3 256-bit hash digest 0x${blake3256}, in public, for a lease term of ${term} finalized blocks on the ${network} network, starting with the block number that the purchase transaction acquiring this license got finalized in.

Maximum profits off of public performances of the lessee must not excceed ${cap}€, otherwise the lessee must monthly payback 50% of the excess profits to above payee via the marketplace in TR3X at the EUR/TR3X payback rate of ${paybackRateEURTR3X}.

The artist name "${artist}" must be visibly included in all digital and physical copies and noticeably mentioned at any public performances explicitely accrediting ${artist} as the creator of "${title}".

Claims of this license must be prooved using tr3x purchase transactions on the ${network} network.
`.trim()
    }
  }
}
