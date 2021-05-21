export default function init(baseUrl) {
  baseUrl = baseUrl.replace(/\/+$/, "")
  return {
    async add(buf) {
      const formdata = new FormData()
      formdata.append(
        "file",
        new Blob([buf], { type: "application/octet-stream" })
      )
      let res = await fetch(
        `${baseUrl}/add?cid-version=1&hash=blake2b-256&pin=false`,
        {
          method: "POST",
          body: formdata
        }
      )
      if (res.status !== 200) {
        throw Error(res.statusText)
      }
      res = await res.json()
      return res.Hash
    },
    async cat(cid) {
      const res = await fetch(`${baseUrl}/cat?arg=${cid}`, { method: "POST" })
      if (res.status !== 200) {
        throw Error(res.statusText)
      }
      const arrBuf = await res.arrayBuffer()
      return new Uint8Array(arrBuf)
    }
  }
}
