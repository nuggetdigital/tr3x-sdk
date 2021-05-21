# tr3x-util

[![ci](https://github.com/nuggetdigital/tr3x-util/workflows/ci/badge.svg)](https://github.com/nuggetdigital/tr3x-util/actions/workflows/ci.yml)

tr3x core utils

## API

``` ts
export async function blake3(): (msg: Uint8Array) => string;

export function blake3hash256hex(msg: Uint8Array) => string;

export const metadata = {
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

// TODO
export const ipfspinr = {
  add(buf: Uint8Array): Promise <{ cid: string }>;
  cat(cid: string): Promise<Uint8Array>;
};
```
