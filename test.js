import tape from "tape"
import { metadata, initIpfs, initHash } from "./index.js"

tape("assembles valid params to lease metadata", t => {
  const artist = "tape-artist"
  const title = "tape-title"
  const price = 1000000000n
  const blake3256 = "deadbeef".repeat(8)
  const copyrightYear = 2021
  const mime = "audio/mp3"
  const cid = "7".repeat(46)
  const network = "Moonbeam"
  const payee = "0x" + "0".repeat(64)
  const term = 100419n
  const cap = 25000n
  const paybackRatioEURTR3X = 1.0

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
    paybackRatioEURTR3X,
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
ratio of ${paybackRatioEURTR3X}.

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
    paybackRatioEURTR3X
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
  const payee = "0x" + "0".repeat(64)

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

tape("blake3256 some data possibly in the browser using wasm", async t => {
  const blake2b = await initHash()

  const hash = blake2b().update(Buffer.from("fraud world")).digest("hex")

  t.same(
    hash,
    "d3d8a505c0ef238d3f2701b072caaf20aa936fc8c8ad51dff35963a5b4719240"
  )
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
