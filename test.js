const tape = require("tape")
const ngin = require(".")

tape("assembles valid params to lease metadata", t => {
  const artist = "tape-artist"
  const title = "tape-title"
  const price = 1000000000n
  const blake3256 = "deadbeef".repeat(8)
  const copyrightYear = 2021
  const mime = "audio/mp3"
  const cidv1base32 = "7".repeat(46)
  const network = "Moonbeam"
  const term = 100419n
  const cap = 25000n
  const paybackRatioEURTR3X = 1.0

  const expected = {
    artist,
    title,
    price: price.toString() + "STYC",
    blake3256: "deadbeef".repeat(8),
    mime,
    cid: cidv1base32,
    term: network + "#" + term.toString(),
    cap: cap.toString() + "€",
    paybackRatioEURTR3X,
    license: `
The tr3x Public Performance Lease License (TR3X PPLL)

Permission is hereby granted, at a charge of ${price}STYC (TR3X), 
to any person purchasing a token of this digital license asset to perform 
the associated track named "${title}", © ${copyrightYear} ${artist}, 
identified by its BLAKE3 256-bit hash digest "${blake3256}", in public 
up until the ${network} network has finalized block number ${term}.

Maximum profits off of public performances of the lessee must not excceed 
${cap}€, otherwise the lessee must monthly payback 100% of the excess 
profits via the marketplace in TR3X at the EUR/TR3X payback ratio of 
${paybackRatioEURTR3X}.

The artist name "${artist}" must be visibly included in all digital and 
physical copies and noticeably mentioned at any public performances 
explicitely accrediting ${artist} as the creator of "${title}".

Claims of this particular license must be verified against their respective 
purchases on the ${network} network.
      `.trim()
  }

  const metadata = ngin.metadata.lease({
    artist,
    title,
    price,
    blake3256,
    copyrightYear,
    mime,
    cidv1base32,
    network,
    term,
    cap,
    paybackRatioEURTR3X
  })

  Object.entries(expected).forEach(([k, v]) => t.equal(metadata[k], v, k))

  t.end()
})

tape("assembles valid params to exclusive metadata", t => {
  const artist = "tape-artist"
  const title = "tape-title"
  const price = 1000000000n
  const blake3256 = "deadbeef".repeat(8)
  const copyrightYear = 2021
  const mime = "audio/mp3"
  const cidv1base32 = "7".repeat(46)
  const network = "Moonbeam"

  const expected = {
    artist,
    title,
    price: price.toString() + "STYC",
    blake3256: "deadbeef".repeat(8),
    mime,
    cid: cidv1base32,
    license: `
The tr3x Public Performance Exclusive License (TR3X PPEL)

Permission is hereby granted, at a charge of ${price}STYC (TR3X), 
to the first person purchasing a token of this digital license 
asset to exclusively perform the associated track named "${title}", 
© ${copyrightYear} ${artist}, identified by its BLAKE3 256-bit hash 
digest "${blake3256}", in public.

The artist name "${artist}" must be visibly included in all digital and 
physical copies and noticeably mentioned at any public performances 
explicitely accrediting ${artist} as the creator of "${title}".

Claims of this particular license must be verified against their respective 
purchases on the ${network} network.
    `.trim()
  }

  const metadata = ngin.metadata.exclusive({
    artist,
    title,
    price,
    blake3256,
    copyrightYear,
    mime,
    cidv1base32,
    network
  })

  Object.entries(expected).forEach(([k, v]) => t.equal(metadata[k], v, k))

  t.end()
})

// WORKS BUT HANGS
tape.skip("ipfs add & cat", async t => {
  const ipfs = await ngin.initIPFS()

  const file = "fraud world"

  const res = await ipfs.add(file)

  t.ok(res.cid)

  const back = await ipfs.cat(res.cid, "utf8")

  t.same(back, file)

  ipfs.kill(t.end)
})

tape("blake3256 some data possibly in the browser using wasm", async t => {
  t.same(
    ngin.blake3256("fraud world"),
    "02cb5a8d8d1c78b28217b8f8dc0230353c45afb92395af643239e38e1d9c1420"
  )
})
