module.exports = {
  metadata: require("./metadata"),
  initIPFS: require("./ipfs"),
  blake3256: require("blake3-wasm").hash
}
