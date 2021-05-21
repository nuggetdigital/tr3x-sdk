import _metadata from "./metadata.js"
// import _initIpfs from "./ipfs.js"
import { init, hash256hex } from "blake3-wasm-sync"

export const metadata = _metadata
// export const initIpfs = _initIpfs

export async function blake3() {
  await init()
  return hash256hex
}
