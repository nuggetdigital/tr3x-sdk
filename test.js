const tape = require("tape")
const ngin = require(".")

tape("assembles valid params to lease metadata", t => {
  const params = {
    artist: "tape-artist",
    title: "tape-title",
    price: 1000000000n,
    blake3256: "deadbeefdeadbeefdeadbeefdeadbeef",
    copyrightYear: 2021,
    mime: "audio/mp3",
    cidv1base32: "7".repeat(46),
    network: "Moonbeam",
    term: 100419n,
    cap: 25000n,
    paybackRatioEURTR3X: 1.0
  }

  const metadata = ngin.lease(params)

  t.same(metadata, {
    artist: "tape-artist",
    title: "tape-title",
    price: "1000000000STYC",
    blake3256: "deadbeefdeadbeefdeadbeefdeadbeef",
    copyrightYear: 2021,
    mime: "audio/mp3",
    cidv1base32: "7".repeat(46),
    network: "Moonbeam",
    term: "100419",
    cap: "25000€",
    paybackRatioEURTR3X: 1.0,
    license: `
The tr3x Public Performance Lease License (TR3X PPLL)

Permission is hereby granted, at a charge of $${price}STYC (TR3X), 
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
  })

  t.end()
})

tape("assembles valid params to exclusive metadata", t => {
  const params = {
    artist: "tape-artist",
    title: "tape-title",
    price: 1000000000n,
    blake3256: "deadbeefdeadbeefdeadbeefdeadbeef",
    copyrightYear: 2021,
    mime: "audio/mp3",
    cidv1base32: "7".repeat(46),
    network: "Moonbeam",
    term: 100419n,
    cap: 25000n,
    paybackRatioEURTR3X: 1.0
  }

  const metadata = ngin.lease(params)

  t.same(metadata, {
    artist: "tape-artist",
    title: "tape-title",
    price: "1000000000STYC",
    blake3256: "deadbeefdeadbeefdeadbeefdeadbeef",
    copyrightYear: 2021,
    mime: "audio/mp3",
    cidv1base32: "7".repeat(46),
    network: "Moonbeam",
    license: `
The tr3x Public Performance Exclusive License (TR3X PPEL)

Permission is hereby granted, at a charge of $${price}STYC (TR3X), 
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
  })

  t.end()
})
