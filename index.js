// NOTE: usin @babel/register's magic here to workaround an ipfs-core dep err
require("@babel/register")({
  // This will override `node_modules` ignoring - you can alternatively pass
  // an array of strings to be explicitly matched or a regex / glob
  ignore: [],
})

module.exports = {
  metadata: require("./metadata"),
  initIPFS: require("./ipfs"),
  blake3256: require("blake3-wasm").hash
}
