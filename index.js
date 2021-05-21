import _metadata from "./metadata.js"
// import _initIpfs from "./ipfs.js"
import { init, hash256hex } from "blake3-wasm-sync"

export const metadata = _metadata
// export const initIpfs = _initIpfs

export const blake3hash256hex = hash256hex

export async function blake3() {
  await init()
  return hash256hex
}
