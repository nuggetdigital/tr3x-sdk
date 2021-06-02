# tr3x-util

[![ci](https://github.com/nuggetdigital/tr3x-util/workflows/ci/badge.svg)](https://github.com/nuggetdigital/tr3x-util/actions/workflows/ci.yml)

tr3x core utils

## qs?

+ include contract address in metadata ? most probly yes

## API

``` ts
export async function blake3(): (msg: Uint8Array) => string;

export function blake3hash256hex(msg: Uint8Array) => string;

export const metadata = {
  /// Serializes any given pojo to a buf.
  serialize(metadata: Object): Uint8Array;
  /// Validates exclusive license parameters and assembles a metadata doc.
  exclusive(params: {
    artist: string,
    title: string,
    price: bigint,
    blake3256: string,
    copyrightYear: number,
    mime: string,
    cid: string,
    evmChainId: number,
    payee: string
  }): {
    artist: string,
    title: string,
    price: string,
    blake3256: string,
    copyrightYear: number,
    mime: string,
    cid: string,
    evmChainId: number,
    payee: string,
    license: string
  },
  /// Validates lease license parameters and assembles a metadata doc.
  lease(params: {
    artist: string,
    title: string,
    price: bigint,
    blake3256: string,
    copyrightYear: number,
    mime: string,
    cid: string,
    evmChainId: number,
    payee: string,
    term: bigint,
    cap: bigint,
    paybackRateEURTR3X: number
  }): {
    artist: string,
    title: string,
    price: bigint,
    blake3256: string,
    copyrightYear: number,
    mime: string,
    cid: string,
    evmChainId: number,
    payee: string,
    license: string,
    term: string,
    cap: string,
    paybackRateEURTR3X: number
  }
}

export const licenseText = {
  /// Assembles an exclusive license text.
  exclusive(params: {
    artist: string,
    title: string,
    price: bigint,
    blake3256: string,
    copyrightYear: number,
    evmChainId: number,
    payee: string
  }, validate: boolean = true): string,
  /// Assembles a lease license text.
  lease(params: {
    artist: string,
    title: string,
    price: bigint,
    blake3256: string,
    copyrightYear: number,
    evmChainId: number,
    payee: string,
    term: bigint,
    cap: bigint,
    paybackRateEURTR3X: number
  }, validate: boolean = true): string
}

/**
 * Creates a client connected to given IPFS node(s).
 * baseUrl should follow format: http(s)://$albDomain/api/v0
 */
export function initIpfs(baseUrl: string): {
  /// Add some data to IPFS.
  add(buf: Uint8Array): Promise<string>;
  /// Gets some data from IPFS.
  cat(cid: string): Promise<Uint8Array>;
}

/***
 * Detects mp3 and wav file formats by their magic numbers.
 * Fallsback to "application/octet-stream"
 */
export function mime(buf: Uint8Array): string

export const SUPPORTED_CHAINS = new Set([ 1, 5, 1285 ])

export const evmChainIdToName = Object.freeze({
  1: "Mainnet",
  5: "Goerli",
  1285: "Moonriver"
})


```
