const VALID_MIME_TYPES = new Set(["audio/wav", "audio/mp3"])
const VALID_NETWORKS = new Set(["Moonbeam", "Moonriver"])

const metadata = {
  exclusive({
    artist,
    title,
    price,
    blake3256,
    copyrightYear,
    mime,
    cidv1base32,
    network
  }) {
    if (!VALID_NETWORKS.has(network))
      throw TypeError(
        `network must be one of ${[...VALID_NETWORKS.join(", ")]}`
      )
    if (typeof artist !== "string" || !artist.length)
      throw TypeError("artist must be a string")
    if (typeof title !== "string" || !title.length)
      throw TypeError("title must be a string")
    if (typeof price !== "bigint" || !(price > 0n))
      throw TypeError("price must be a bigint gt 0")
    if (!/^[a-f0-9]{64}$/.test(blake3256))
      throw TypeError("blake3256 must be a hex string")
    if (!/^[0-9]{4}$/.test(copyrightYear?.toString()))
      throw TypeError("copyrightYear must be intlike")
    if (!/^[a-z2-7]+=*$/.test(cidv1base32) || cidv1base32.length !== 46)
      throw TypeError("invalid cidv1base32")
    if (!VALID_MIME_TYPES.has(mime)) throw TypeError("invalid mime")
    return {
      // IPFS content identifier of the track
      cidv1: cidv1base32,
      // BLAKE3 256-bit hash digest of the track
      blake3256,
      title,
      mime,
      artist,
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
`.trim(),
      // minimum STYC price
      price: price.toString()
    }
  },
  lease({
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
  }) {
    if (!VALID_NETWORKS.has(network))
      throw TypeError(
        `network must be one of ${[...VALID_NETWORKS.join(", ")]}`
      )
    if (typeof artist !== "string" || !artist.length)
      throw TypeError("artist must be a string")
    if (typeof title !== "string" || !title.length)
      throw TypeError("title must be a string")
    if (typeof price !== "bigint" || !(price > 0n))
      throw TypeError("price must be a bigint gt 0")
    if (!/^[a-f0-9]{64}$/.test(blake3256))
      throw TypeError("blake3256 must be a hex string")
    if (!/^[0-9]{4}$/.test(copyrightYear?.toString()))
      throw TypeError("copyrightYear must be intlike")
    if (!/^[a-z2-7]+=*$/.test(cidv1base32) || cidv1base32.length !== 46)
      throw TypeError("invalid cidv1base32")
    if (!VALID_MIME_TYPES.has(mime)) throw TypeError("invalid mime")
    if (typeof term !== "bigint") throw TypeError("term must be a bigint")
    if (typeof cap !== "bigint") throw TypeError("cap must be a bigint")
    // NOTE: ratio repr as number in range 0..1 ? (only in .js - not .sol)
    if (
      typeof paybackRatioEURTR3X !== "number" ||
      !(paybackRatioEURTR3X > 0) ||
      paybackRatioEURTR3X > 1
    )
      throw TypeError("paybackRatioEURTR3X must be a float gt 0 and lte 1")
    return {
      // IPFS content identifier of the track
      cidv1: cidv1base32,
      // BLAKE3 256-bit hash digest of the track
      blake3256,
      title,
      mime,
      artist,
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
`.trim(),
      // minimum STYC price
      price: price.toString() + "STYC",
      // payback exchange rate for lease violations
      paybackRatioEURTR3X,
      // ~lease validity period - expiry date expressed as finalized block number
      term: term.toString(),
      // maximum permitted EUR profits from public performances
      cap: cap.toString() + "€"
    }
  }
}
