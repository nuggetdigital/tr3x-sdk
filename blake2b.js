import blake2b from "blake2b-wasm"

export default function initBlake2b() {
  if (!blake2b.SUPPORTED)
    throw Error("WebAssembly not supported by your runtime")
  return new Promise((res, rej) =>
    blake2b.ready(err => (err ? rej(err) : res(blake2b)))
  )
}
