export * from "./defs"
export * from "./metadata"
export * from "./license"
export * from "./mime"
export * from "./ipfs"

import { init, hash256hex } from "blake3-hash-wasm/index"
import { Hash256Hex } from "./defs"

export const blake3hash256hex: Hash256Hex = hash256hex

export async function blake3(): Promise<Hash256Hex> {
  await init()
  return hash256hex
}
