const IPFS = require("ipfs-core")
const lite = require("text-encoder-lite")
const enc = new lite.TextEncoderLite()

module.exports = async function init() {
  const ipfs = await IPFS.create()
  return {
    /**
     * Adds some data to IPFS.
     * @param {string|Uint8Array} data Metadata JSON string or a track's bytes
     * @returns {Promise<{cid, ...}>} Result object incl. a cid
     */
    async add(data) {
      if (data?.constructor?.name !== "Uint8Array" && typeof data !== "string")
        throw TypeError("invalid data type")
      const buf = typeof data === "string" ? enc.encode(data) : data
      return ipfs.add(buf)
    },
    /**
     * Gets some data from IPFS.
     * @param {string} cid Content identifier
     * @param {string} outputEncoding How to return the data
     *   - binary - return a Uint8Array
     *   - utf8 - return a utf8 string
     *   - pojo - return a plain object by parsing the data as JSON
     * @returns {Object|string|Uint8Array} The file data.
     */
    async cat(cid, outputEncoding = "binary") {
      for await (const buf of ipfs.cat(cid)) {
        // NOTE: early exit because we only expect a single buffer
        switch (outputEncoding) {
          case "binary":
            return new Uint8Array(buf)
          case "utf8":
            return buf.toString("utf8")
          case "pojo":
            return JSON.parse(buf.toString("utf8"))
          default:
            throw TypeError("invalid outputEncoding " + outputEncoding)
        }
      }
    },
    kill(cb) {
      return ipfs.stop(cb)
    }
  }
}
