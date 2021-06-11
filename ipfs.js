const NAIVE_CHECK = /^http(:?s)?:\/\/\S+\.\S+/

export default function init(albBaseURL, distBaseURL) {
  if (!NAIVE_CHECK.test(albBaseURL)) {
    throw TypeError("invalid alb base url")
  }
  if (!NAIVE_CHECK.test(distBaseURL)) {
    throw TypeError("invalid dist base url")
  }
  distBaseURL = distBaseURL.replace(/\/+$/, "")
  return {
    async add(buf) {
      let res = await fetch(albBaseURL, { method: "POST", body: buf })
      if (res.status !== 200) {
        throw Error(`${res.status} ${res.statusText} - ${await res.text()}`)
      }
      res = await res.json()
      return res.Hash
    },
    async cat(cid) {
      const res = await fetch(`${distBaseURL}/${cid}`)
      if (res.status !== 200) {
        throw Error(`${res.status} ${res.statusText} - ${await res.text()}`)
      }
      const arrBuf = await res.arrayBuffer()
      return new Uint8Array(arrBuf)
    }
  }
}
