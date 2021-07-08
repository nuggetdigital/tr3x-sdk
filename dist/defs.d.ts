export declare const SUPPORTED_CHAINS: Set<number>;
export declare const EVM_CHAIN_NAMES: {
    [key: number]: string;
};
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
export declare type Hash256Hex = (msg: Uint8Array) => string;
