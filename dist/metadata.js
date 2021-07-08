import { validateExclusiveParams, validateLeaseParams } from "./validate";
import { leaseLicenseText, exclusiveLicenseText } from "./license";
import { encode, decode } from "./util";
export function serializeMetadata(metadata) {
    return encode(JSON.stringify(metadata));
}
export function deserializeMetadata(buf) {
    return JSON.parse(decode(buf));
}
export function exclusiveLicenseMetadata(params) {
    validateExclusiveParams(params);
    return {
        artists: params.artists,
        title: params.title,
        // IPFS content identifier of the track
        cid: params.cid,
        // BLAKE3 256-bit hash digest of the track
        blake3256: params.blake3256.startsWith("0x")
            ? params.blake3256
            : "0x" + params.blake3256,
        // content type for convenience, extendability & browsers
        mime: params.mime,
        // minimum STYC price
        price: params.price.toString() + "STYC",
        // an Ethereum address
        payee: params.payee,
        evmChainId: params.evmChainId,
        copyrightYear: params.copyrightYear,
        license: exclusiveLicenseText(params, false)
    };
}
export function leaseLicenseMetadata(params) {
    validateLeaseParams(params);
    return {
        artists: params.artists,
        title: params.title,
        // IPFS content identifier of the track
        cid: params.cid,
        // BLAKE3 256-bit hash digest of the track
        blake3256: params.blake3256.startsWith("0x")
            ? params.blake3256
            : "0x" + params.blake3256,
        // content type for convenience, extendability & browsers
        mime: params.mime,
        // minimum STYC price
        price: params.price.toString() + "STYC",
        // an Ethereum address
        payee: params.payee,
        // payback exchange rate for lease violations
        paybackRateEURTR3X: params.paybackRateEURTR3X,
        // ~lease validity period - expiry date expressed as finalized block count
        term: params.term.toString() + " finalized blocks",
        // maximum permitted EUR profits from public performances
        cap: params.cap.toString() + "€",
        evmChainId: params.evmChainId,
        copyrightYear: params.copyrightYear,
        license: leaseLicenseText(params, false)
    };
}
