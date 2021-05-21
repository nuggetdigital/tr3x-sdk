import _metadata from "./metadata.js"
import _initIpfs from "./ipfs.js"
import { init as initBlake3, hash256hex } from "blake3-hash-wasm"

export const metadata = _metadata

export const initIpfs = _initIpfs

export const blake3hash256hex = hash256hex

export async function blake3() {
  await initBlake3()
  return hash256hex
}
