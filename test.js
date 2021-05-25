import tape from "tape"
import { metadata, blake3, blake3hash256hex, initIpfs } from "./index.js"
import fetch from "node-fetch"
import FormData from "form-data"

globalThis.fetch = fetch
globalThis.FormData = FormData

tape("assembles valid params to lease metadata", t => {
  const artist = "tape-artist"
  const title = "tape-title"
  const price = 1000000000n
  const blake3256 = "deadbeef".repeat(8)
  const copyrightYear = 2021
  const mime = "audio/mp3"
  const cid = "7".repeat(46)
  const network = "Moonbeam"
  const payee = "0x" + "0".repeat(40)
  const term = 100419n
  const cap = 25000n
  const paybackRateEURTR3X = 1.0

  const expected = {
    artist,
    title,
    price: price.toString() + "STYC",
    payee,
    blake3256: "deadbeef".repeat(8),
    mime,
    cid,
    network,
    copyrightYear,
    term: network + " " + term.toString(),
    cap: cap.toString() + "€",
    paybackRateEURTR3X,
    license: `
tr3x public performance lease license

Permission is hereby granted, at a charge of ${price}STYC (TR3X), payable to ${network} network address ${payee}, to any person purchasing a token of this digital license asset to perform the associated track named "${title}", © ${copyrightYear} ${artist}, identified by its BLAKE3 256-bit hash digest 0x${blake3256}, in public, for a lease term of ${term} finalized blocks on the ${network} network, starting with the block number that the purchase transaction acquiring this license got finalized in.

Maximum profits off of public performances of the lessee must not excceed ${cap}€, otherwise the lessee must monthly payback 50% of the excess profits to above payee via the marketplace in TR3X at the EUR/TR3X payback rate of ${paybackRateEURTR3X}.

The artist name "${artist}" must be visibly included in all digital and physical copies and noticeably mentioned at any public performances explicitely accrediting ${artist} as the creator of "${title}".

Claims of this license must be prooved using tr3x purchase transactions on the ${network} network.
      `.trim()
  }

  const artifact = metadata.lease({
    artist,
    title,
    price,
    payee,
    blake3256,
    copyrightYear,
    mime,
    cid,
    network,
    term,
    cap,
    paybackRateEURTR3X
  })

  Object.entries(expected).forEach(([k, v]) => t.equal(artifact[k], v, k))

  t.end()
})

tape("assembles valid params to exclusive metadata", t => {
  const artist = "tape-artist"
  const title = "tape-title"
  const price = 1000000000n
  const blake3256 = "deadbeef".repeat(8)
  const copyrightYear = 2021
  const mime = "audio/mp3"
  const cid = "7".repeat(46)
  const network = "Moonbeam"
  const payee = "0x" + "0".repeat(40)

  const expected = {
    artist,
    title,
    price: price.toString() + "STYC",
    payee,
    blake3256,
    mime,
    cid,
    network,
    copyrightYear,
    license: `
tr3x public performance exclusive license

Permission is hereby granted, at a charge of ${price}STYC (TR3X), payable to ${network} network address ${payee}, to the first person purchasing a token of this digital license asset to exclusively perform the associated track named "${title}", © ${copyrightYear} ${artist}, identified by its BLAKE3 256-bit hash digest 0x${blake3256}, in public.

The artist name "${artist}" must be visibly included in all digital and physical copies and noticeably mentioned at any public performances explicitely accrediting ${artist} as the creator of "${title}".

Claims of this particular license must be verified against their respective purchases on the ${network} network.
    `.trim()
  }

  const artifact = metadata.exclusive({
    artist,
    title,
    price,
    payee,
    blake3256,
    copyrightYear,
    mime,
    cid,
    network
  })

  Object.entries(expected).forEach(([k, v]) => t.equal(artifact[k], v, k))

  t.end()
})

tape("blake3256 some data possibly in the browser using wasm", async t => {
  await blake3()

  t.same(
    blake3hash256hex(Uint8Array.from(Buffer.from("fraud world"))),
    "02cb5a8d8d1c78b28217b8f8dc0230353c45afb92395af643239e38e1d9c1420"
  )
})

// DIRTY SIDE EFFECTS
tape("ipfs add & cat", async t => {
  const ipfs = initIpfs(`http://${process.env.ALB}/api/v0/`)

  const ufo = "fraud world"

  const buf = new TextEncoder().encode(ufo)

  const cid = await ipfs.add(buf)

  t.ok(cid)

  const back = await ipfs.cat(cid)

  t.equal(new TextDecoder().decode(back), ufo)
})
