# tr3x-util

[![ci](https://github.com/nuggetdigital/tr3x-util/workflows/ci/badge.svg)](https://github.com/nuggetdigital/tr3x-util/actions/workflows/ci.yml)

tr3x core utils

## API

``` ts
export async function blake3(): (msg: Uint8Array) => string;

export function blake3hash256hex(msg: Uint8Array) => string;

export const metadata = {
  /// Validates exclusive license parameters and assembles a metadata doc.
  exclusive(params: {
    artist: string,
    title: string,
    price: bigint,
    blake3256: string,
    copyrightYear: number,
    mime: string,
    cid: string,
    network: string,
    payee: string
  }): {
    artist: string,
    title: string,
    price: string,
    blake3256: string,
    copyrightYear: number,
    mime: string,
    cid: string,
    network: string,
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
    network: string,
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
    network: string,
    payee: string,
    license: string,
    term: string,
    cap: string,
    paybackRateEURTR3X: number
  }
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
```
