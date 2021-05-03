import tape from "tape"
import { metadata, initIpfs, blake3hash256hex } from "./index.js"

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
    term: network + " " + term.toString(),
    cap: cap.toString() + "€",
    paybackRateEURTR3X,
    license: `
tr3x public performance lease license

Permission is hereby granted, at a charge of ${price}STYC (TR3X), 
payable to ${network} network address ${payee}, to any person purchasing 
a token of this digital license asset to perform the associated track 
named "${title}", © ${copyrightYear} ${artist}, identified by its BLAKE3 
256-bit hash digest ${blake3256}, in public, for a lease term of ${term} 
finalized blocks on the ${network} network, starting with the block number 
that the purchase transaction acquiring this license got finalized in.

Maximum profits off of public performances of the lessee must not excceed 
${cap}€, otherwise the lessee must monthly payback 50% of the excess 
profits to above payee via the marketplace in TR3X at the EUR/TR3X payback 
rate of ${paybackRateEURTR3X}.

The artist name "${artist}" must be visibly included in all digital and 
physical copies and noticeably mentioned at any public performances 
explicitely accrediting ${artist} as the creator of "${title}".

Claims of this license must be prooved using tr3x purchase transactions on 
the ${network} network.
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
    license: `
tr3x public performance exclusive license

Permission is hereby granted, at a charge of ${price}STYC (TR3X), 
payable to ${network} network address ${payee}, to the first person 
purchasing a token of this digital license asset to exclusively 
perform the associated track named "${title}", © ${copyrightYear} 
${artist}, identified by its BLAKE3 256-bit hash digest ${blake3256}, 
in public.

The artist name "${artist}" must be visibly included in all digital and 
physical copies and noticeably mentioned at any public performances 
explicitely accrediting ${artist} as the creator of "${title}".

Claims of this particular license must be verified against their respective 
purchases on the ${network} network.
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

tape("blake3256 some data possibly in the browser using wasm", t => {
  t.same(
    blake3hash256hex(Uint8Array.from(Buffer.from("fraud world"))),
    "d3d8a505c0ef238d3f2701b072caaf20aa936fc8c8ad51dff35963a5b4719240"
  )

  t.end()
})

// WORKS BUT HANGS
tape.skip("ipfs add & cat", async t => {
  const ipfs = await initIpfs()

  const file = "fraud world"

  const res = await ipfs.add(file)

  t.ok(res.cid)

  const back = await ipfs.cat(res.cid, "utf8")

  t.same(Buffer.from(back).toString(), file)

  ipfs.kill(t.end)
})
