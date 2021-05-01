import IPFS from "ipfs-core"

export default async function init() {
  const ipfs = await IPFS.create()
  return {
    async add(buf) {
      return ipfs.add(buf)
    },

    async cat(cid) {
      for await (const buf of ipfs.cat(cid)) {
        // NOTE: early exit because we only expect a single buffer
        return new Uint8Array(buf)
      }
    },
    kill(cb) {
      return ipfs.stop(cb)
    }
  }
}
