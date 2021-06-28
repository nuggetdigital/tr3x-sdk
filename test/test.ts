import { readFileSync } from "fs"
import tape from "tape"
import {
  leaseLicenseMetadata,
  exclusiveLicenseMetadata,
  mime,
  blake3,
  blake3hash256hex,
  createIpfsPinrClient,
  EVM_CHAIN_NAMES,
  serializeMetadata,
  deserializeMetadata
} from "../index"
import { commaList } from "../util"
import { createRequire } from "module"
import fetch from "node-fetch"

const require = createRequire(import.meta.url)
globalThis.fetch = fetch

tape("assembles valid params to lease metadata", t => {
  const artists = ["tape-artist1", "tape-artist2", "tape-artist3"]
  const title = "tape-title"
  const price = 1000000000n
  const blake3256 = "deadbeef".repeat(8)
  const copyrightYear = 2021
  const mime = "audio/mpeg"
  const cid = "7".repeat(62)
  const evmChainId = 5
  const payee = "0x" + "0".repeat(40)
  const term = 100419n
  const cap = 25000n
  const paybackRateEURTR3X = 1.0

  const expected = {
    artists,
    title,
    price: price.toString() + "STYC",
    payee,
    blake3256: "0x" + "deadbeef".repeat(8),
    mime,
    cid,
    evmChainId,
    copyrightYear,
    term: term.toString() + " finalized blocks",
    cap: cap.toString() + "€",
    paybackRateEURTR3X,
    license: `
tr3x public performance lease license

Permission is hereby granted, at a charge of ${price}STYC (TR3X), payable to ${
      EVM_CHAIN_NAMES[evmChainId]
    } chain address ${payee}, to any person purchasing a token of this digital license asset to perform the associated track named "${title}", © ${copyrightYear} ${commaList(
      artists,
      "and"
    )}, identified by its BLAKE3 256-bit hash digest 0x${blake3256}, in public, for a lease term of ${term} finalized blocks on the ${
      EVM_CHAIN_NAMES[evmChainId]
    } chain, starting with the block number that the purchase transaction acquiring this license got finalized in.

Maximum profits off of public performances of the lessee must not excceed ${cap}€, otherwise the lessee must monthly payback 50% of the excess profits to above payee via the marketplace in TR3X at the EUR/TR3X payback rate of ${paybackRateEURTR3X}.

The artist name${artists.length > 1 ? "s" : ""} "${commaList(
      artists,
      "and"
    )}" must be visibly included in all digital and physical copies and noticeably mentioned at any public performances explicitely accrediting ${commaList(
      artists,
      "and"
    )} as the creator${artists.length > 1 ? "s" : ""} of "${title}".

Claims of this license must be prooved using tr3x purchase transactions on the ${
      EVM_CHAIN_NAMES[evmChainId]
    } chain.
      `.trim()
  }

  const artifact = leaseLicenseMetadata({
    artists,
    title,
    price,
    payee,
    blake3256,
    copyrightYear,
    mime,
    cid,
    evmChainId,
    term,
    cap,
    paybackRateEURTR3X
  })

  Object.entries(expected).forEach(([k, v]) => t.equal(artifact[k], v, k))

  t.end()
})

tape("assembles valid params to exclusive metadata", t => {
  const artists = ["tape-artist1", "tape-artist2", "tape-artist3"]
  const title = "tape-title"
  const price = 1000000000n
  const blake3256 = "0x" + "deadbeef".repeat(8)
  const copyrightYear = 2021
  const mime = "audio/mpeg"
  const cid = "7".repeat(62)
  const evmChainId = 5
  const payee = "0x" + "0".repeat(40)

  const expected = {
    artists,
    title,
    price: price.toString() + "STYC",
    payee,
    blake3256,
    mime,
    cid,
    evmChainId,
    copyrightYear,
    license: `
tr3x public performance exclusive license

Permission is hereby granted, at a charge of ${price}STYC (TR3X), payable to ${
      EVM_CHAIN_NAMES[evmChainId]
    } chain address ${payee}, to the first person purchasing a token of this digital license asset to exclusively perform the associated track named "${title}", © ${copyrightYear} ${commaList(
      artists,
      "and"
    )}, identified by its BLAKE3 256-bit hash digest 0x${blake3256}, in public.

The artist name${artists.length > 1 ? "s" : ""} "${commaList(
      artists,
      "and"
    )}" must be visibly included in all digital and physical copies and noticeably mentioned at any public performances explicitely accrediting ${commaList(
      artists,
      "and"
    )} as the creator${artists.length > 1 ? "s" : ""} of "${title}".

Claims of this particular license must be verified against their respective purchases on the ${
      EVM_CHAIN_NAMES[evmChainId]
    } chain.
    `.trim()
  }

  const artifact = exclusiveLicenseMetadata({
    artists,
    title,
    price,
    payee,
    blake3256,
    copyrightYear,
    mime,
    cid,
    evmChainId
  })

  Object.entries(expected).forEach(([k, v]) => t.equal(artifact[k], v, k))

  t.end()
})

tape("blake3256 some data possibly in the browser using wasm", async t => {
  await blake3()

  t.equal(
    blake3hash256hex(Uint8Array.from(Buffer.from("fraud world"))),
    "02cb5a8d8d1c78b28217b8f8dc0230353c45afb92395af643239e38e1d9c1420",
    "blake3hash256hex"
  )
})

tape("detects a wav file", t => {
  const buf = readFileSync(require.resolve("./celesta.wav"))
  t.equal(mime(buf), "audio/x-wav", "wav")
  t.end()
})

tape("detects an ogg file", t => {
  const buf = readFileSync(require.resolve("./celesta.ogg"))
  t.equal(mime(buf), "audio/ogg", "ogg")
  t.end()
})

tape("detects a mp3 file", t => {
  const buf = readFileSync(require.resolve("./celesta.mp3"))
  t.equal(mime(buf), "audio/mpeg", "mp3")
  t.end()
})

tape("mime fallback is 'application/octet-stream'", t => {
  t.equal(
    mime(new Uint8Array([65, 67, 65, 66])),
    "application/octet-stream",
    "bin"
  )
  t.end()
})

tape("metadata de/serialization", t => {
  const input = { fraud: "money" }

  // NOTE: does not validate just convert a pojo to a buf
  const buf = serializeMetadata(input as any)

  t.true(buf.byteLength > 0, "lengthy metadata buf")
  t.equal(buf.constructor.name, "Uint8Array", "bytes")

  const output = deserializeMetadata(buf)

  t.same(input, output, "wire roundtrip")

  t.end()
})

// DIRTY SIDE EFFECTS
tape("ipfs add & cat", async t => {
  const ipfs = createIpfsPinrClient(
    `http://${process.env.ALB_DOMAIN_NAME}`,
    `https://${process.env.DIST_DOMAIN_NAME}`
  )

  const ufo = "fraud world"

  const buf = new TextEncoder().encode(ufo)

  const cid = await ipfs.add(buf)

  t.ok(cid, "cid")

  const back = await ipfs.cat(cid)

  t.equal(new TextDecoder().decode(back), ufo, "ipfs roundtrip")
})
