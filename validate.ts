import { SUPPORTED_CHAINS, VALID_MIME_TYPES } from "./defs"

export function validateExclusiveParams(
  params: { [key: string]: any },
  onlyForLicenseText: boolean = false
): void {
  if (!SUPPORTED_CHAINS.has(params.evmChainId)) {
    throw TypeError(
      `chain must be one of ${Array.from(SUPPORTED_CHAINS).join(", ")}`
    )
  }

  if (
    params.artists?.constructor?.name !== "Array" ||
    !params.artists.length ||
    !params.artists.every(name => name && typeof name === "string")
  ) {
    throw TypeError("artists must be a nonempty string array")
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
    if (!/^[a-z2-7]{32,}$/.test(params.cid)) {
      throw TypeError("invalid cidv1")
    }

    if (!VALID_MIME_TYPES.has(params.mime)) {
      throw TypeError("invalid mime")
    }
  }
}

export function validateLeaseParams(
  params: { [key: string]: any },
  onlyForLicenseText: boolean = false
): void {
  if (!SUPPORTED_CHAINS.has(params.evmChainId)) {
    throw TypeError(
      `chain must be one of ${Array.from(SUPPORTED_CHAINS).join(", ")}`
    )
  }

  if (
    params.artists?.constructor?.name !== "Array" ||
    !params.artists?.length
  ) {
    throw TypeError("artists must be a nonempty string array")
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
