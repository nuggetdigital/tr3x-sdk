# tr3x-sdk

[![ci](https://github.com/nuggetdigital/tr3x-sdk/workflows/ci/badge.svg)](https://github.com/nuggetdigital/tr3x-sdk/actions/workflows/ci.yml)

tr3x core utils

## API

### `index.ts`

```ts
export * from "./defs";
export * from "./metadata";
export * from "./license";
export * from "./mime";
export * from "./ipfs";
export declare const blake3hash256hex: Hash256Hex;
export declare function blake3(): Promise<Hash256Hex>;
```

### `defs.ts`

``` ts
export declare type Hash256Hex = (msg: Uint8Array) => string;
export declare const SUPPORTED_CHAINS: Set<number>;
export declare const EVM_CHAIN_NAMES: { [key: number]: string; };
export declare const VALID_MIME_TYPES: Set<string>;
export interface ExclusiveLicenseParams {
    artists: string[];
    title: string;
    price: bigint;
    blake3256: string;
    copyrightYear: number;
    mime: string;
    cid: string;
    evmChainId: number;
    payee: string;
}
export interface ExclusiveLicenseMetadata {
    artists: string[];
    title: string;
    price: string;
    blake3256: string;
    copyrightYear: number;
    mime: string;
    cid: string;
    evmChainId: number;
    payee: string;
    license: string;
}
export interface LeaseLicenseParams {
    artists: string[];
    title: string;
    price: bigint;
    blake3256: string;
    copyrightYear: number;
    mime: string;
    cid: string;
    evmChainId: number;
    payee: string;
    term: bigint;
    cap: bigint;
    paybackRateEURTR3X: number;
}
export interface LeaseLicenseMetadata {
    artists: string[];
    title: string;
    price: string;
    blake3256: string;
    copyrightYear: number;
    mime: string;
    cid: string;
    evmChainId: number;
    payee: string;
    license: string;
    term: string;
    cap: string;
    paybackRateEURTR3X: number;
}
export interface LeaseLicenseTextParams {
    artists: string[];
    title: string;
    price: bigint;
    blake3256: string;
    copyrightYear: number;
    evmChainId: number;
    payee: string;
    term: bigint;
    cap: bigint;
    paybackRateEURTR3X: number;
}
export interface ExclusiveLicenseTextParams {
    artists: string[];
    title: string;
    price: bigint;
    blake3256: string;
    copyrightYear: number;
    evmChainId: number;
    payee: string;
}
export interface IpfsPinrClient {
    add(buf: Uint8Array): Promise<string>;
    cat(cid: string): Promise<Uint8Array>;
}
```

### `ipfs.ts`

``` ts
export declare function createIpfsPinrClient(albBaseURL: string, distBaseURL: string): IpfsPinrClient;
```

### `license.ts`

``` ts
export declare function leaseLicenseText(params: LeaseLicenseTextParams, validate?: boolean): string;
export declare function exclusiveLicenseText(params: ExclusiveLicenseTextParams, validate?: boolean): string;
```

### `metadata.ts`

``` ts
export declare function serializeMetadata(metadata: LeaseLicenseMetadata | ExclusiveLicenseMetadata): Uint8Array;
export declare function deserializeMetadata(buf: Uint8Array): LeaseLicenseMetadata | ExclusiveLicenseMetadata;
export declare function exclusiveLicenseMetadata(params: ExclusiveLicenseParams): ExclusiveLicenseMetadata;
export declare function leaseLicenseMetadata(params: LeaseLicenseParams): LeaseLicenseMetadata;

```

### `mime.ts`

``` ts
export declare function isMp3(buf: Uint8Array): boolean;
export declare function isWav(buf: Uint8Array): boolean;
export declare function isOgg(buf: Uint8Array): boolean;
export declare function mime(buf: Uint8Array): string;
```

### `validate.ts`

``` ts 
export declare function validateExclusiveParams(
  params: { [key: string]: any; },
  onlyForLicenseText?: boolean
): void;
export declare function validateLeaseParams(
  params: { [key: string]: any; },
  onlyForLicenseText?: boolean
): void;
```
