import _metadata from "./metadata.js"
// import _initIpfs from "./ipfs.js"
import { init, hash256hex } from "blake3-wasm-sync"

export const metadata = _metadata
// export const initIpfs = _initIpfs

let _blake3_init = false

export async function blake3() {
  if (!_blake3_init) {
    await init()
    _blake3_init = true
  }
  return hash256hex
}
