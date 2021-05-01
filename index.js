import babelsome from "@babel/register"

// NOTE: usin @babel/register's magic here to workaround an ipfs-core dep err
babelsome({
  // This will override `node_modules` ignoring - you can alternatively pass
  // an array of strings to be explicitly matched or a regex / glob
  ignore: []
})

import _metadata from "./metadata.js"
import _initIPFS from "./ipfs.js"
import { hash } from "blake3-wasm"

export const metadata = _metadata
export const initIPFS = _initIPFS
export const blake3256 = hash
