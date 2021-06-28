export const SUPPORTED_CHAINS: Set<number> = new Set([1, 5, 1284, 1285])

export const EVM_CHAIN_NAMES: { [key: number]: string } = Object.freeze({
  1: "Mainnet",
  5: "Goerli",
  1284: "Moonbeam",
  1285: "Moonriver"
})

export const VALID_MIME_TYPES: Set<string> = new Set([
  "audio/x-wav",
  "audio/mpeg",
  "audio/ogg",
  "application/octet-stream"
])

export interface ExclusiveLicenseParams {
  artists: string[]
  title: string
  price: bigint
  blake3256: string
  copyrightYear: number
  mime: string
  cid: string
  evmChainId: number
  payee: string
}

export interface ExclusiveLicenseMetadata {
  artists: string[]
  title: string
  price: string
  blake3256: string
  copyrightYear: number
  mime: string
  cid: string
  evmChainId: number
  payee: string
  license: string
}

export interface LeaseLicenseParams {
  artists: string[]
  title: string
  price: bigint
  blake3256: string
  copyrightYear: number
  mime: string
  cid: string
  evmChainId: number
  payee: string
  term: bigint
  cap: bigint
  paybackRateEURTR3X: number
}

export interface LeaseLicenseMetadata {
  artists: string[]
  title: string
  price: string
  blake3256: string
  copyrightYear: number
  mime: string
  cid: string
  evmChainId: number
  payee: string
  license: string
  term: string
  cap: string
  paybackRateEURTR3X: number
}

export interface LeaseLicenseTextParams {
  artists: string[]
  title: string
  price: bigint
  blake3256: string
  copyrightYear: number
  evmChainId: number
  payee: string
  term: bigint
  cap: bigint
  paybackRateEURTR3X: number
}

export interface ExclusiveLicenseTextParams {
  artists: string[]
  title: string
  price: bigint
  blake3256: string
  copyrightYear: number
  evmChainId: number
  payee: string
}

export interface IpfsPinrClient {
  add(buf: Uint8Array): Promise<string>
  cat(cid: string): Promise<Uint8Array>
}

export type Hash256Hex = (msg: Uint8Array) => string
