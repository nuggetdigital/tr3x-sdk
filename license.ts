import { commaList } from "./util"
import { validateExclusiveParams, validateLeaseParams } from "./validate"
import {
  EVM_CHAIN_NAMES,
  LeaseLicenseTextParams,
  ExclusiveLicenseTextParams
} from "./defs"

export function leaseLicenseText(
  params: LeaseLicenseTextParams,
  validate: boolean = true
) {
  if (validate) {
    validateLeaseParams(params, true)
  }

  const artistsList = commaList(params.artists, "and")

  return `
tr3x public performance lease license

Permission is hereby granted, at a charge of ${
    params.price
  }STYC (TR3X), payable to ${
    EVM_CHAIN_NAMES[params.evmChainId]
  } chain address ${
    params.payee
  }, to any person purchasing a token of this digital license asset to perform the associated track named "${
    params.title
  }", © ${
    params.copyrightYear
  } ${artistsList}, identified by its BLAKE3 256-bit hash digest 0x${
    params.blake3256
  }, in public, for a lease term of ${params.term} finalized blocks on the ${
    EVM_CHAIN_NAMES[params.evmChainId]
  } chain, starting with the block number that the purchase transaction acquiring this license got finalized in.

Maximum profits off of public performances of the lessee must not excceed ${
    params.cap
  }€, otherwise the lessee must monthly payback 50% of the excess profits to above payee via the marketplace in TR3X at the EUR/TR3X payback rate of ${
    params.paybackRateEURTR3X
  }.

The artist name${
    params.artists.length > 1 ? "s" : ""
  } "${artistsList}" must be visibly included in all digital and physical copies and noticeably mentioned at any public performances explicitely accrediting ${artistsList} as the creator${
    params.artists.length > 1 ? "s" : ""
  } of "${params.title}".

Claims of this license must be prooved using tr3x purchase transactions on the ${
    EVM_CHAIN_NAMES[params.evmChainId]
  } chain.
`.trim()
}

export function exclusiveLicenseText(
  params: ExclusiveLicenseTextParams,
  validate: boolean = true
) {
  if (validate) {
    validateExclusiveParams(params, true)
  }

  const artistsList = commaList(params.artists, "and")

  return `
tr3x public performance exclusive license

Permission is hereby granted, at a charge of ${
    params.price
  }STYC (TR3X), payable to ${
    EVM_CHAIN_NAMES[params.evmChainId]
  } chain address ${
    params.payee
  }, to the first person purchasing a token of this digital license asset to exclusively perform the associated track named "${
    params.title
  }", © ${
    params.copyrightYear
  } ${artistsList}, identified by its BLAKE3 256-bit hash digest 0x${
    params.blake3256
  }, in public.

The artist name${
    params.artists.length > 1 ? "s" : ""
  } "${artistsList}" must be visibly included in all digital and physical copies and noticeably mentioned at any public performances explicitely accrediting ${artistsList} as the creator${
    params.artists.length > 1 ? "s" : ""
  } of "${params.title}".

Claims of this particular license must be verified against their respective purchases on the ${
    EVM_CHAIN_NAMES[params.evmChainId]
  } chain.
`.trim()
}
