export const SUPPORTED_CHAINS = new Set([1, 5, 1285])

export const evmChainIdToName = Object.freeze({
  1: "Mainnet",
  5: "Goerli",
  1285: "Moonriver"
})

export const VALID_MIME_TYPES = new Set([
  "audio/wav",
  "audio/mpeg",
  "application/octet-stream"
])
