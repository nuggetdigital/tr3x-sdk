import babelsome from "@babel/register"

// NOTE: usin @babel/register's magic here to workaround an ipfs-core dep err
babelsome({
  // This will override `node_modules` ignoring - you can alternatively pass
  // an array of strings to be explicitly matched or a regex / glob
  ignore: []
})

import _metadata from "./metadata.js"
import _initIpfs from "./ipfs.js"
import _init from "./blake2b.js"

export const metadata = _metadata
export const initIpfs = _initIpfs
export const initBlake2b = _init