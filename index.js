const VALID_MIME_TYPES = new Set(["audio/wav","audio/mp3"])

const VALID_NETWORKS = new Set(["Moonbeam", "Moonriver"])

module.exports = {
    exclusive({ artist, title, price, blake3256, copyrightYear, mime, cidv1base32,
    network }) {
      if (!VALID_NETWORKS.has(network)) throw TypeError(`network must be one of ${[...new Set([1,2,3])].join(", ")}`)
      if (typeof artist !== "string" || !artist.length) throw TypeError("artist must be a string")
      if (typeof title !== "string" || !title.length) throw TypeError("title must be a string")
      if (typeof price !== "bigint" || !(price >0n)) throw TypeError("price must be a bigint gt 0")
      if (!/^[a-f0-9]{64}$/.test(blake3256)) throw TypeError("blake3256 must be a hex string")
      if (!/^[0-9]{4}$/.test(copyrightYear?.toString())) throw TypeError("copyrightYear must be intlike")
      if (!/^[a-z2-7]+=*$/.test(cidv1base32) || cidv1base32.length !== 46) throw TypeError("invalid cidv1base32")
      if (!VALID_MIME_TYPES.has(mime)) throw TypeError("invalid mime")

    },
    lease({ artist, title, price, blake3256, copyrightYear, mime, cidv1base32,
      network, term, cap, paybackRatioEURTR3X
    }) {
      if (!VALID_NETWORKS.has(network)) throw TypeError(`network must be one of ${[...new Set([1,2,3])].join(", ")}`)
      if (typeof artist !== "string" || !artist.length) throw TypeError("artist must be a string")
      if (typeof title !== "string" || !title.length) throw TypeError("title must be a string")
      if (typeof price !== "bigint" || !(price >0n)) throw TypeError("price must be a bigint gt 0")
      if (!/^[a-f0-9]{64}$/.test(blake3256)) throw TypeError("blake3256 must be a hex string")
      if (!/^[0-9]{4}$/.test(copyrightYear?.toString())) throw TypeError("copyrightYear must be intlike")
      if (!/^[a-z2-7]+=*$/.test(cidv1base32) || cidv1base32.length !== 46) throw TypeError("invalid cidv1base32")
      if (!VALID_MIME_TYPES.has(mime)) throw TypeError("invalid mime")
      if (typeof term !== "bigint") throw TypeError("term must be a bigint")
      if (typeof cap !== "bigint") throw TypeError("cap must be a bigint")
      // NOTE: ratio repr as number in range 0..1 ? (only in .js - not .sol)
      if (typeof paybackRatioEURTR3X !== number ||!(paybackRatioEURTR3X  >0) ||paybackRatioEURTR3X >1) throw TypeError("paybackRatioEURTR3X must be a float gt 0 and lte 1")
      return {
          cid: cidv1base32, // IPFS content identifier of the track
  blake3256, // BLAKE3 256-bit hash digest of the track
  title,
  mime,
  artist,
  license: `TODO`, // TODO TR3X PPEL/PPLL license or derivative
  price: price.toString(), // minimum STYC
  paybackRatioEURTR3X, // payback exchange rate for lease violations
  term: term.toString(), // ~lease validity period - expiry date expressed as finalized block number
  cap: cap.toString() // maximum EUR profits from public performances
      }
    }
}

  // cid: "<track cidv1base32>", // IPFS content identifier of the track
  // blake3256: "<track blake3256>", // BLAKE3 256-bit hash digest of the track
  // title: "<track name>",
  // mime: "application/wav", // std mime
  // artist: "<artist name>",
  // license: "<templated license text>", // TR3X PPEL/PPLL license or derivative
  // price: 1000000000000000000000 // minimum STYC
  // // TODO: how2 repr an exchange rate with solidity data types?
  // paybackExchangeRateEURTR3X: 1.0, // TODO
  // term: 100419, // ~lease validity period - expiry date expressed as finalized block number
  // cap: 25000 // maximum EUR profits from public performances

  /*
    The tr3x Public Performance Exclusive License (TR3X PPEL)

  Permission is hereby granted, at a charge of <exclusive license price> 
  STYC (TR3X), to the first person purchasing a token of this digital license 
  asset to exclusively perform the associated track named "<track title>", 
  © <copyright year> <artist name>, identified by its BLAKE3 256-bit hash 
  digest "<blake3256>", in public.
  
  The artist name "<artist name>" must be visibly included in all digital and 
  physical copies and noticeably mentioned at any public performances 
  explicitely accrediting <artist name> as the creator of "<track name>".

  Claims of this particular license must be verified against their respective 
  purchases on the Moonbeam <NETWORK>.
  */

  /*
    The tr3x Public Performance Lease License (TR3X PPLL)

  Permission is hereby granted, at a charge of <exclusive license price> 
  STYC (TR3X), to any person purchasing a token of this digital license 
  asset to perform the associated track named "<track title>", 
  © <copyright year> <artist name>, identified by its BLAKE3 256-bit hash 
  digest "<blake3256>", in public up until Moonbeam <NETWORK> has finalized 
  block number <block number>.
  
  Maximum profits off of public performances of the lessee must not excceed 
  <lease cap>, otherwise the lessee must monthly payback 100% of the excess 
  profits via the marketplace in TR3X at the EUR/TR3X payback ratio of 
  <payback ratio>.
  
  The artist name "<artist name>" must be visibly included in all digital and 
  physical copies and noticeably mentioned at any public performances 
  explicitely accrediting <artist name> as the creator of "<track name>".

  Claims of this particular license must be verified against their respective 
  purchases on the Moonbeam <NETWORK>.
  */