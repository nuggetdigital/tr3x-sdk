import blake2b from "blake2b-wasm"

if (!blake2b.SUPPORTED) {
  console.log("WebAssembly not supported by your runtime")
}

export default function initBlake2b() {
  return new Promise((res, rej) => {
    blake2b.ready(function (err) {
      if (err) return rej(err)
      res(blake2b)
    })
  })
}
