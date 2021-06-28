import { IpfsPinrClient } from "./defs"

const NAIVE_CHECK: RegExp = /^http(:?s)?:\/\/\S+\.\S+/

export function createIpfsPinrClient(
  albBaseURL: string,
  distBaseURL: string
): IpfsPinrClient {
  if (!NAIVE_CHECK.test(albBaseURL)) {
    throw TypeError("invalid alb base url")
  }

  if (!NAIVE_CHECK.test(distBaseURL)) {
    throw TypeError("invalid dist base url")
  }

  distBaseURL = distBaseURL.replace(/\/+$/, "")

  return {
    async add(buf: Uint8Array): Promise<string> {
      let res = await fetch(albBaseURL, { method: "POST", body: buf })

      if (res.status !== 200) {
        throw Error(`${res.status} ${res.statusText} - ${await res.text()}`)
      }

      const doc = await res.json()

      return doc.Hash
    },

    async cat(cid: string): Promise<Uint8Array> {
      const res = await fetch(`${distBaseURL}/${cid}`)

      if (res.status !== 200) {
        throw Error(`${res.status} ${res.statusText} - ${await res.text()}`)
      }

      const arrBuf = await res.arrayBuffer()

      return new Uint8Array(arrBuf)
    }
  }
}
