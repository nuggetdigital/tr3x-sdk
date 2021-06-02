import FormData from "form-data"
import { Buffer } from "buffer"

globalThis.Buffer = Buffer
globalThis.FormData = FormData

export default function init(baseUrl) {
  baseUrl = baseUrl.replace(/\/+$/, "")
  return {
    async add(buf) {
      const formdata = new FormData(/*{ maxDataSize: 5e8 }*/) // 500 MB
      formdata.append("file", Buffer.from(buf))
      let res = await fetch(
        `${baseUrl}/add?cid-version=1&hash=blake2b-256&pin=false`,
        {
          method: "POST",
          body: formdata,
        }
      )
      if (res.status !== 200) {
        throw Error(`${res.status} ${res.statusText} - ${await res.text()}`)
      }
      res = await res.json()
      return res.Hash
    },
    async cat(cid) {
      const res = await fetch(`${baseUrl}/cat?arg=${cid}`, { method: "POST" })
      if (res.status !== 200) {
        throw Error(`${res.status} ${res.statusText} - ${await res.text()}`)
      }
      const arrBuf = await res.arrayBuffer()
      return new Uint8Array(arrBuf)
    }
  }
}
