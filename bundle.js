/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __nccwpck_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__nccwpck_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__nccwpck_require__.o(definition, key) && !__nccwpck_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__nccwpck_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__nccwpck_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";/************************************************************************/
var __webpack_exports__ = {};
// ESM COMPAT FLAG
__nccwpck_require__.r(__webpack_exports__);

// EXPORTS
__nccwpck_require__.d(__webpack_exports__, {
  "EVM_CHAIN_NAMES": () => (/* reexport */ EVM_CHAIN_NAMES),
  "SUPPORTED_CHAINS": () => (/* reexport */ SUPPORTED_CHAINS),
  "VALID_MIME_TYPES": () => (/* reexport */ VALID_MIME_TYPES),
  "blake3": () => (/* binding */ blake3),
  "blake3hash256hex": () => (/* binding */ blake3hash256hex),
  "createIpfsPinrClient": () => (/* reexport */ createIpfsPinrClient),
  "deserializeMetadata": () => (/* reexport */ deserializeMetadata),
  "exclusiveLicenseMetadata": () => (/* reexport */ exclusiveLicenseMetadata),
  "exclusiveLicenseText": () => (/* reexport */ exclusiveLicenseText),
  "isMp3": () => (/* reexport */ isMp3),
  "isOgg": () => (/* reexport */ isOgg),
  "isWav": () => (/* reexport */ isWav),
  "leaseLicenseMetadata": () => (/* reexport */ leaseLicenseMetadata),
  "leaseLicenseText": () => (/* reexport */ leaseLicenseText),
  "mime": () => (/* reexport */ mime),
  "serializeMetadata": () => (/* reexport */ serializeMetadata)
});

;// CONCATENATED MODULE: ./defs.ts
const SUPPORTED_CHAINS = new Set([1, 5, 1284, 1285]);
const EVM_CHAIN_NAMES = Object.freeze({
    1: "Mainnet",
    5: "Goerli",
    1284: "Moonbeam",
    1285: "Moonriver"
});
const VALID_MIME_TYPES = new Set([
    "audio/x-wav",
    "audio/mpeg",
    "audio/ogg",
    "application/octet-stream"
]);

;// CONCATENATED MODULE: ./validate.ts

function validateExclusiveParams(params, onlyForLicenseText = false) {
    if (!SUPPORTED_CHAINS.has(params.evmChainId)) {
        throw TypeError(`chain must be one of ${Array.from(SUPPORTED_CHAINS).join(", ")}`);
    }
    if (params.artists?.constructor?.name !== "Array" ||
        !params.artists.length ||
        !params.artists.every(name => name && typeof name === "string")) {
        throw TypeError("artists must be a nonempty string array");
    }
    if (typeof params.title !== "string" || !params.title.length) {
        throw TypeError("title must be a string");
    }
    if (typeof params.price !== "bigint" || !(params.price > 0n)) {
        throw TypeError("price must be a bigint gt 0");
    }
    if (!/^(0x)?[a-f0-9]{64}$/.test(params.blake3256)) {
        throw TypeError("blake3256 must be a hex string");
    }
    if (!/^[0-9]{4}$/.test(params.copyrightYear?.toString())) {
        throw TypeError("copyrightYear must be intlike");
    }
    if (!/^(0x)?[0-9a-fA-F]{40}$/.test(params.payee)) {
        throw TypeError("payee must match the ethereum address format");
    }
    if (!onlyForLicenseText) {
        if (!/^[a-z2-7]{32,}$/.test(params.cid)) {
            throw TypeError("invalid cidv1");
        }
        if (!VALID_MIME_TYPES.has(params.mime)) {
            throw TypeError("invalid mime");
        }
    }
}
function validateLeaseParams(params, onlyForLicenseText = false) {
    if (!SUPPORTED_CHAINS.has(params.evmChainId)) {
        throw TypeError(`chain must be one of ${Array.from(SUPPORTED_CHAINS).join(", ")}`);
    }
    if (params.artists?.constructor?.name !== "Array" ||
        !params.artists?.length) {
        throw TypeError("artists must be a nonempty string array");
    }
    if (typeof params.title !== "string" || !params.title.length) {
        throw TypeError("title must be a string");
    }
    if (typeof params.price !== "bigint" || !(params.price > 0n)) {
        throw TypeError("price must be a bigint gt 0");
    }
    if (!/^(0x)?[a-f0-9]{64}$/.test(params.blake3256)) {
        throw TypeError("blake3256 must be a hex string");
    }
    if (!/^[0-9]{4}$/.test(params.copyrightYear?.toString())) {
        throw TypeError("copyrightYear must be intlike");
    }
    if (!/^(0x)?[0-9a-fA-F]{40}$/.test(params.payee)) {
        throw TypeError("payee must match the ethereum address format");
    }
    if (typeof params.term !== "bigint" || !(params.term > 0n)) {
        throw TypeError("term must be a bigint gt 0");
    }
    if (typeof params.cap !== "bigint" || !(params.cap > 0n)) {
        throw TypeError("cap must be a bigint gt 0");
    }
    if (typeof params.paybackRateEURTR3X !== "number" ||
        !(params.paybackRateEURTR3X > 0)) {
        throw TypeError("paybackRateEURTR3X must be a float gt 0");
    }
    if (!onlyForLicenseText) {
        if (!/^[a-z2-7]{32,}$/.test(params.cid)) {
            throw TypeError("invalid cidv1");
        }
        if (!VALID_MIME_TYPES.has(params.mime)) {
            throw TypeError("invalid mime");
        }
    }
}

;// CONCATENATED MODULE: ./util.ts
const encoder = new TextEncoder();
const decoder = new TextDecoder();
function encode(str) {
    return encoder.encode(str);
}
function decode(buf) {
    return decoder.decode(buf);
}
function commaList(arr, conjunction = "and") {
    return arr.reduce((acc, cur, i) => {
        if (i === arr.length - 2 && arr.length > 2) {
            acc += cur + ", " + conjunction + " ";
        }
        else if (i === arr.length - 2 && arr.length === 2) {
            acc += cur + " " + conjunction + " ";
        }
        else if (i !== arr.length - 1) {
            acc += cur + ", ";
        }
        else {
            acc += cur;
        }
        return acc;
    }, "");
}

;// CONCATENATED MODULE: ./license.ts



function leaseLicenseText(params, validate = true) {
    if (validate) {
        validateLeaseParams(params, true);
    }
    const artistsList = commaList(params.artists, "and");
    return `
tr3x public performance lease license

Permission is hereby granted, at a charge of ${params.price}STYC (TR3X), payable to ${EVM_CHAIN_NAMES[params.evmChainId]} chain address ${params.payee}, to any person purchasing a token of this digital license asset to perform the associated track named "${params.title}", © ${params.copyrightYear} ${artistsList}, identified by its BLAKE3 256-bit hash digest 0x${params.blake3256}, in public, for a lease term of ${params.term} finalized blocks on the ${EVM_CHAIN_NAMES[params.evmChainId]} chain, starting with the block number that the purchase transaction acquiring this license got finalized in.

Maximum profits off of public performances of the lessee must not excceed ${params.cap}€, otherwise the lessee must monthly payback 50% of the excess profits to above payee via the marketplace in TR3X at the EUR/TR3X payback rate of ${params.paybackRateEURTR3X}.

The artist name${params.artists.length > 1 ? "s" : ""} "${artistsList}" must be visibly included in all digital and physical copies and noticeably mentioned at any public performances explicitely accrediting ${artistsList} as the creator${params.artists.length > 1 ? "s" : ""} of "${params.title}".

Claims of this license must be prooved using tr3x purchase transactions on the ${EVM_CHAIN_NAMES[params.evmChainId]} chain.
`.trim();
}
function exclusiveLicenseText(params, validate = true) {
    if (validate) {
        validateExclusiveParams(params, true);
    }
    const artistsList = commaList(params.artists, "and");
    return `
tr3x public performance exclusive license

Permission is hereby granted, at a charge of ${params.price}STYC (TR3X), payable to ${EVM_CHAIN_NAMES[params.evmChainId]} chain address ${params.payee}, to the first person purchasing a token of this digital license asset to exclusively perform the associated track named "${params.title}", © ${params.copyrightYear} ${artistsList}, identified by its BLAKE3 256-bit hash digest 0x${params.blake3256}, in public.

The artist name${params.artists.length > 1 ? "s" : ""} "${artistsList}" must be visibly included in all digital and physical copies and noticeably mentioned at any public performances explicitely accrediting ${artistsList} as the creator${params.artists.length > 1 ? "s" : ""} of "${params.title}".

Claims of this particular license must be verified against their respective purchases on the ${EVM_CHAIN_NAMES[params.evmChainId]} chain.
`.trim();
}

;// CONCATENATED MODULE: ./metadata.ts



function serializeMetadata(metadata) {
    return encode(JSON.stringify(metadata));
}
function deserializeMetadata(buf) {
    return JSON.parse(decode(buf));
}
function exclusiveLicenseMetadata(params) {
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
function leaseLicenseMetadata(params) {
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

;// CONCATENATED MODULE: ./mime.ts
function isMp3(buf) {
    return (buf.length > 2 &&
        ((buf[0] === 0x49 && buf[1] === 0x44 && buf[2] === 0x33) || // ID3v2
            // Final bit (has crc32) may be or may not be set.
            (buf[0] === 0xff && buf[1] === 0xfb)));
}
function isWav(buf) {
    return (buf.length > 11 &&
        buf[0] === 0x52 &&
        buf[1] === 0x49 &&
        buf[2] === 0x46 &&
        buf[3] === 0x46 &&
        buf[8] === 0x57 &&
        buf[9] === 0x41 &&
        buf[10] === 0x56 &&
        buf[11] === 0x45);
}
function isOgg(buf) {
    return (buf.length > 3 &&
        buf[0] === 0x4f &&
        buf[1] === 0x67 &&
        buf[2] === 0x67 &&
        buf[3] === 0x53);
}
function mime(buf) {
    if (isMp3(buf))
        return "audio/mpeg";
    if (isWav(buf))
        return "audio/x-wav";
    if (isOgg(buf))
        return "audio/ogg";
    return "application/octet-stream";
}

;// CONCATENATED MODULE: ./ipfs.ts
const NAIVE_CHECK = /^http(:?s)?:\/\/\S+\.\S+/;
function createIpfsPinrClient(albBaseURL, distBaseURL) {
    if (!NAIVE_CHECK.test(albBaseURL)) {
        throw TypeError("invalid alb base url");
    }
    if (!NAIVE_CHECK.test(distBaseURL)) {
        throw TypeError("invalid dist base url");
    }
    distBaseURL = distBaseURL.replace(/\/+$/, "");
    return {
        async add(buf) {
            let res = await fetch(albBaseURL, { method: "POST", body: buf });
            if (res.status !== 200) {
                throw Error(`${res.status} ${res.statusText} - ${await res.text()}`);
            }
            const doc = await res.json();
            return doc.Hash;
        },
        async cat(cid) {
            const res = await fetch(`${distBaseURL}/${cid}`);
            if (res.status !== 200) {
                throw Error(`${res.status} ${res.statusText} - ${await res.text()}`);
            }
            const arrBuf = await res.arrayBuffer();
            return new Uint8Array(arrBuf);
        }
    };
}

;// CONCATENATED MODULE: ./node_modules/blake3-hash-wasm/index.js
const WASM_BASE64 = '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A0GgAWogAEEwaikDADcDACADQagBaiAAQThqKQMANwMAIANBsAFqIABBQGspAwA3AwAgA0G4AWogAEHIAGopAwA3AwAgA0HAAWogAEHQAGopAwA3AwAgA0HIAWogAEHYAGopAwA3AwAgA0HQAWogAEHgAGopAwA3AwAgAyAAKQMINwN4IAMgACkDKDcDmAEgAEHpAGotAAAhCyAALQBqIQYgAyAALQBoIg46ANgBIAMgACkDACIWNwNwIAMgBiALRXJBAnIiCzoA2QEgA0H4AWoiBiAKKQIANwMAIANB8AFqIg8gBSkCADcDACADQegBaiIFIAQpAgA3AwAgAyAAKQIINwPgASADQeABaiADQZgBaiAOIBYgCxABIAYoAgAhCiAPKAIAIQsgBSgCACEGIAMoAvwBIQ4gAygC9AEhDyADKALsASEUIAMoAuQBIQggAygC4AEhBSAAIAApAwAQCSAAQfAOaiIJLQAAIgdBN08NAiAAIAdBBXRqIgRBkAFqIAU2AgAgAEEIaiIFIAApA3A3AwAgBUEIaiAAQfgAaikDADcDACAFQRBqIABBgAFqKQMANwMAIAVBGGogAEGIAWopAwA3AwAgBEGsAWogDjYCACAEQagBaiAKNgIAIARBpAFqIA82AgAgBEGgAWogCzYCACAEQZwBaiAUNgIAIARBmAFqIAY2AgAgBEGUAWogCDYCACAJIAdBAWo6AAAgACAAKQMAQgF8NwMAIABBKGoiBEE4akIANwMAIARBMGpCADcDACAEQShqQgA3AwAgBEEgakIANwMAIARBGGpCADcDACAEQRBqQgA3AwAgBEEIakIANwMAIARCADcDACAAQQA7AWggASAMaiEBCyACQYEITwRAIABBkAFqIRUgAEHwAGohDiAAKQMAIRYgA0EoaiEMIANBCGohFCADQZgBaiEKIANB+ABqIQsgAEHwDmohDwNAIBZCCoYhF0F/IAJBAXZndkEBaiEEA0AgBCIFQQF2IQQgFyAFQX9qrYNCAFINAAsgBUEKdq0hFwJAIAVBgAhNBEAgCkIANwMAIApBCGoiB0IANwMAIApBEGoiCUIANwMAIApBGGoiDUIANwMAIApBIGoiEEIANwMAIApBKGoiEUIANwMAIApBMGoiEkIANwMAIApBOGoiE0IANwMAIAsgDikDADcDACALQQhqIgQgDkEIaikDADcDACALQRBqIgYgDkEQaikDADcDACALQRhqIgggDkEYaikDADcDACADQQA7AdgBIAMgFjcDcCADIAAtAGo6ANoBIANB8ABqIAEgBRASIBQgCykDADcDACAUQQhqIAQpAwA3AwAgFEEQaiAGKQMANwMAIBRBGGogCCkDADcDACAMIAopAwA3AwAgDEEIaiAHKQMANwMAIAxBEGogCSkDADcDACAMQRhqIA0pAwA3AwAgDEEgaiAQKQMANwMAIAxBKGogESkDADcDACAMQTBqIBIpAwA3AwAgDEE4aiATKQMANwMAIAMtANoBIQcgAy0A2QEhCSADIAMtANgBIg06AGggAyADKQNwIhY3AwAgAyAHIAlFckECciIHOgBpIANB+AFqIgkgCCkCADcDACADQfABaiIIIAYpAgA3AwAgA0HoAWoiBiAEKQIANwMAIAMgCykCADcD4AEgA0HgAWogDCANIBYgBxABIAkoAgAhByAIKAIAIQkgBigCACENIAMoAvwBIRAgAygC9AEhESADKALsASESIAMoAuQBIQYgAygC4AEhEyAAIAApAwAQCSAPLQAAIghBN08NBiAVIAhBBXRqIgQgEzYCACAEIBA2AhwgBCAHNgIYIAQgETYCFCAEIAk2AhAgBCASNgIMIAQgDTYCCAwBCyACIAVJDQYgA0HwAGogASAFIA4gFiAALQBqEBEgACAAKQMAEAkgAygCjAEhByADKAKIASEJIAMoAoQBIQ0gAygCgAEhECADKAJ8IREgAygCeCESIAMoAnQhBiADKAJwIRMgDy0AACIIQTdPDQggFSAIQQV0aiIEIBM2AgAgBCAHNgIcIAQgCTYCGCAEIA02AhQgBCAQNgIQIAQgETYCDCAEIBI2AgggBCAGNgIEIA8gCEEBajoAACAAIAApAwAgF0IBiHwQCSADKAKsASEHIAMoAqgBIQkgAygCpAEhDSADKAKgASEQIAMoApwBIREgAygCmAEhEiADKAKUASEGIAMoApABIRMgDy0AACIIQTdPDQggFSAIQQV0aiIEIBM2AgAgBCAHNgIcIAQgCTYCGCAEIA02AhQgBCAQNgIQIAQgETYCDCAEIBI2AggLIAQgBjYCBCAPIAhBAWo6AAAgACAAKQMAIBd8IhY3AwAgAiAFSQ0GIAEgBWohASACIAVrIgJBgAhLDQALCyACRQ0AIAAgASACEBIgACAAKQMAEAkLIANBgAJqJAAPCyADIA42AowBIAMgCjYCiAEgAyAPNgKEASADIAs2AoABIAMgFDYCfCADIAY2AnggAyAINgJ0IAMgBTYCcCADQfAAakGMhsAAECEACyADIBA2AvwBIAMgBzYC+AEgAyARNgL0ASADIAk2AvABIAMgEjYC7AEgAyANNgLoASADIAY2AuQBIAMgEzYC4AEgA0HgAWpBjIbAABAhAAsgBSACQfiDwAAQIwALIAUgAkGIhMAAECQACyADIAc2AhwgAyAJNgIYIAMgDTYCFCADIBA2AhAgAyARNgIMIAMgEjYCCCADIAY2AgQgAyATNgIAIANBjIbAABAhAAvgCQIQfwR+IwBBkAFrIgIkAAJAAkACQCABQfAOai0AACIGRQRAIAAgASkDCDcDCCAAIAEpAyg3AyggAEEQaiABQRBqKQMANwMAIABBGGogAUEYaikDADcDACAAQSBqIAFBIGopAwA3AwAgAEEwaiABQTBqKQMANwMAIABBOGogAUE4aikDADcDACAAQUBrIAFBQGspAwA3AwAgAEHIAGogAUHIAGopAwA3AwAgAEHQAGogAUHQAGopAwA3AwAgAEHYAGogAUHYAGopAwA3AwAgAEHgAGogAUHgAGopAwA3AwAgAUHpAGotAAAhBCABLQBqIQMgACABLQBoOgBoIAAgASkDADcDACAAIAMgBEVyQQJyOgBpDAELIAFBkAFqIQcCQAJ/QQAgAS0AaCIKayABQekAai0AACIDQQZ0RwRAIAJBEGogAUEQaikDADcDACACQRhqIAFBGGopAwA3AwAgAkEgaiABQSBqKQMANwMAIAJBMGogAUEwaikDADcDACACQThqIAFBOGopAwA3AwAgAkFAayABQUBrKQMANwMAIAJByABqIAFByABqKQMANwMAIAJB0ABqIAFB0ABqKQMANwMAIAJB2ABqIAFB2ABqKQMANwMAIAJB4ABqIAFB4ABqKQMANwMAIAIgASkDCDcDCCACIAEpAyg3AyggAiABLQBqIgQgA0VyQQJyIgM6AGkgAiAKOgBoIAIgASkDACISNwMAIARBBHIhBCAGIQUgAkEIagwBCyAGQX5qIQUgBkECSQ0DIAJBEGogAUH4AGopAwA3AwAgAkEYaiABQYABaikDADcDACACQSBqIAFB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AwAgC0EQaiAJQRBqIgwpAwA3AwAgC0EYaiAJQRhqIg0pAwA3AwAgAiAEKQAANwOQASAAQThqIAJByAFqKQMANwAAIABBMGogAkHAAWopAwA3AAAgAEEoaiACQbgBaikDADcAACAAQSBqIAopAwA3AAAgAEEYaiADKQMANwAAIABBEGogBSkDADcAACAAQQhqIAYpAwA3AAAgACACKQOQATcAACACQcAAOgCIASACIBA6AIkBIAJCADcDICADIA0pAgA3AwAgBSAMKQIANwMAIAYgCCkCADcDACACIAkpAgA3A5ABIAJBkAFqIABBwABCACAQEAEgAygCACEEIAUoAgAhBSAGKAIAIQYgAigCrAEhCCACKAKkASEMIAIoApwBIQ0gAigClAEhESACKAKQASESIAdB/wFxIgNBN08NBCAPIANBBXRqIgMgEjYCACADIAg2AhwgAyAENgIYIAMgDDYCFCADIAU2AhAgAyANNgIMIAMgBjYCCCADIBE2AgQgDiAHQQFqIgM6AAAgA0H/AXEgE0sNAAsLIAJB0AFqJAAPC0G0gcAAQStB2IPAABArAAtBtIHAAEErQeiDwAAQKwALIAIgCDYCrAEgAiAENgKoASACIAw2AqQBIAIgBTYCoAEgAiANNgKcASACIAY2ApgBIAIgETYClAEgAiASNgKQASACQZABakGMhsAAECEAC7cFAQh/QStBgIDEACAAKAIAIgVBAXEiAxshBiACIANqIQRB9InAAEEAIAVBBHEbIQdBASEDAkACQCAAKAIIQQFHBEAgACAGIAcQKg0BDAILIABBDGooAgAiCCAETQRAIAAgBiAHECoNAQwCCwJAAkACQCAFQQhxBEAgACgCBCEJIABBMDYCBCAALQAgIQogAEEBOgAgIAAgBiAHECoNBEEAIQMgCCAEayIEIQVBASAALQAgIgYgBkEDRhtBA3FBAWsOAgECAwtBACEDIAggBGsiBCEFAkACQAJAQQEgAC0AICIIIAhBA0YbQQNxQQFrDgIBAAILIARBAXYhAyAEQQFqQQF2IQUMAQtBACEFIAQhAwsgA0EBaiEDIABBHGooAgAhCCAAKAIEIQQgACgCGCEJAkADQCADQX9qIgNFDQEgCSAEIAgoAhARAABFDQALQQEPC0EBIQMgBEGAgMQARg0DIAAgBiAHECoNAyAAKAIYIAEgAiAAKAIcKAIMEQIADQMgACgCHCEBIAAoAhghAEEAIQMCfwNAIAUgAyAFRg0BGiADQQFqIQMgACAEIAEoAhARAABFDQALIANBf2oLIAVJIQMMAwtBACEFIAQhAwwBCyAEQQF2IQMgBEEBakEBdiEFCyADQQFqIQMgAEEcaigCACEGIAAoAgQhBCAAKAIYIQcCQANAIANBf2oiA0UNASAHIAQgBigCEBEAAEUNAAtBAQ8LQQEhAyAEQYCAxABGDQAgACgCGCABIAIgACgCHCgCDBECAA0AIAAoAhwhASAAKAIYIQNBACECAkADQCACIAVGDQEgAkEBaiECIAMgBCABKAIQEQAARQ0AC0EBIQMgAkF/aiAFSQ0BCyAAIAo6ACAgACAJNgIEQQAPCyADDwsgACgCGCABIAIgAEEcaigCACgCDBECAAudBQEFfyMAQTBrIgIkACAAKAIAIQACQAJAAkACQAJAAkAgAUGAAU8EQCACQQA2AgwgAUGAEEkNASABQYCABEkEQCACIAFBP3FBgAFyOgAOIAIgAUEMdkHgAXI6AAwgAiABQQZ2QT9xQYABcjoADUEDIQEMBAsgAiABQT9xQYABcjoADyACIAFBEnZB8AFyOgAMIAIgAUEGdkE/cUGAAXI6AA4gAiABQQx2QT9xQYABcjoADUEEIQEMAwsgACgCCCIFIABBBGooAgBHBEAgACgCACEDDAILIAVBAWoiAyAFSQ0DIAVBAXQiBCADIAQgA0sbIgNBCCADQQhLGyEDAkAgBUUEQCACQQA2AiAMAQsgAkEoakEBNgIAIAIgBTYCJCACIAAoAgA2AiALIAJBEGogAyACQSBqEB4gAkEYaigCACEEIAIoAhQhAyACKAIQQQFHBEAgACADNgIAIABBBGogBDYCAAwCCyAERQ0DIAMgBBBQAAsgAiABQT9xQYABcjoADSACIAFBBnZBwAFyOgAMQQIhAQwBCyAAIAVBAWo2AgggAyAFaiABOgAADAMLIABBBGooAgAiBCAAQQhqKAIAIgVrIAFPBEAgASAFaiEDIAAoAgAhBAwCCyABIAVqIgMgBUkNACAEQQF0IgYgAyAGIANLGyIGQQggBkEISxshBgJAIARFBEAgAkEANgIgDAELIAJBKGpBATYCACACIAQ2AiQgAiAAKAIANgIgCyACQRBqIAYgAkEgahAeIAJBGGooAgAhBiACKAIUIQQgAigCEEEBRwRAIAAgBDYCACAAQQRqIAY2AgAMAgsgBkUNACAEIAYQUAALEEkACyAEIAVqIAJBDGogARAvGiAAQQhqIAM2AgALIAJBMGokAEEAC7MFAQl/IwBBMGsiAyQAIANBJGogATYCACADQQM6ACggA0KAgICAgAQ3AwggAyAANgIgIANBADYCGCADQQA2AhACfwJAAkAgAigCCCIEBEAgAigCACEHIAIoAgQiCCACQQxqKAIAIgYgBiAISxsiBkUNASAAIAcoAgAgBygCBCABKAIMEQIADQIgB0EMaiEAIAIoAhAhCSAGIQoDQCADIARBHGotAAA6ACggAyAEQQRqKQIAQiCJNwMIIARBGGooAgAhAkEAIQVBACEBAkACQAJAIARBFGooAgBBAWsOAgACAQsgAkEDdCAJaiILKAIEQRNHDQEgCygCACgCACECC0EBIQELIAMgAjYCFCADIAE2AhAgBEEQaigCACECAkACQAJAIARBDGooAgBBAWsOAgACAQsgAkEDdCAJaiIBKAIEQRNHDQEgASgCACgCACECC0EBIQULIAMgAjYCHCADIAU2AhggCSAEKAIAQQN0aiIBKAIAIANBCGogASgCBBEAAA0DIApBf2oiCkUEQCAGIQUMAwsgBEEgaiEEIABBfGohASAAKAIAIQIgAEEIaiEAIAMoAiAgASgCACACIAMoAiQoAgwRAgBFDQALDAILIAIoAgAhByACKAIEIgggAkEUaigCACIGIAYgCEsbIgZFDQAgAigCECEFIAAgBygCACAHKAIEIAEoAgwRAgANAUEAIQQgBiECA0AgBCAFaiIAKAIAIANBCGogAEEEaigCABEAAA0CIAJBf2oiAkUEQCAGIQUMAgsgBCAHaiEAIARBCGohBCADKAIgIABBCGooAgAgAEEMaigCACADKAIkKAIMEQIARQ0ACwwBCyAIIAVLBEAgAygCICAHIAVBA3RqIgAoAgAgACgCBCADKAIkKAIMEQIADQELQQAMAQtBAQsgA0EwaiQAC8wEAQR/IAAgARBRIQICQAJAAkAgABBNDQAgACgCACEDIAAQRgRAIAEgA2pBEGohAAwCCyABIANqIQECQCAAIAMQUiIAQbSRwAAoAgBHBEAgA0H/AU0EQCAAQQxqKAIAIgQgAEEIaigCACIFRw0C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QQALIAJFBEAgACABNgIEDAELIAAgAjYCBEEAIQUhAwsgACAFNgIAIABBCGogAzYCAAuiAQEDfyMAQRBrIgEkACAAKAIAIgJBFGooAgAhAwJAAn8CQAJAIAIoAgQOAgABAwsgAw0CQQAhAkH8h8AADAELIAMNASACKAIAIgMoAgQhAiADKAIACyEDIAEgAjYCBCABIAM2AgAgAUGAicAAIAAoAgQoAgggACgCCBAbAAsgAUEANgIEIAEgAjYCACABQeyIwAAgACgCBCgCCCAAKAIIEBsAC40BAQR+IABCADcDACAAQYgBakHQg8AAKQIAIgE3AgAgAEGAAWpByIPAACkCACICNwIAIABB+ABqQcCDwAApAgAiAzcCACAAQbiDwAApAgAiBDcCcCAAIAQ3AgggAEEQaiADNwIAIABBGGogAjcCACAAQSBqIAE3AgAgAEHwDmpBADoAACAAQShqQcMAEDMLgwEBAX8jAEFAaiICJAAgAkErNgIMIAJB0IXAADYCCCACIAE2AhQgAiAANgIQIAJBLGpBAjYCACACQTxqQRQ2AgAgAkICNwIcIAJB+InAADYCGCACQRU2AjQgAiACQTBqNgIoIAIgAkEQajYCOCACIAJBCGo2AjAgAkEYakGIh8AAEDIAC2wBAX8jAEEwayIDJAAgAyABNgIEIAMgADYCACADQRxqQQI2AgAgA0EsakESNgIAIANCAjcCDCADQcyKwAA2AgggA0ESNgIkIAMgA0EgajYCGCADIAM2AiggAyADQQRqNgIgIANBCGogAhAyAAtsAQF/IwBBMGsiAyQAIAMgATYCBCADIAA2AgAgA0EcakECNgIAIANBLGpBEjYCACADQgI3AgwgA0H8jMAANgIIIANBEjYCJCADIANBIGo2AhggAyADQQRqNgIoIAMgAzYCICADQQhqIAIQMgALbAEBfyMAQTBrIgMkACADIAE2AgQgAyAANgIAIANBHGpBAjYCACADQSxqQRI2AgAgA0ICNwIMIANB3IzAADYCCCADQRI2AiQgAyADQSBqNgIYIAMgA0EEajYCKCADIAM2AiAgA0EIaiACEDIAC1YBAn8jAEEgayICJAAgAEEcaigCACEDIAAoAhggAkEYaiABQRBqKQIANwMAIAJBEGogAUEIaikCADcDACACIAEpAgA3AwggAyACQQhqEAwgAkEg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'

function toBuf(base64) {
  if (typeof atob === 'function') {
    return Uint8Array.from(atob(base64), c => c.charCodeAt(0))
  } else {
    return Buffer.from(base64, 'base64')
  }
}

let wasm

async function init() {
  if (!wasm && typeof document === 'object') {
    const res = await WebAssembly.instantiateStreaming(
      fetch(
        URL.createObjectURL(new Blob([toBuf(WASM_BASE64)], { type: 'application/wasm' }))
      ),
      {}
    )
    wasm = res.instance.exports
  }
}

if (!wasm && typeof document === 'undefined') {
  wasm = new WebAssembly.Instance(new WebAssembly.Module(toBuf(WASM_BASE64)), {
    wbg: {
      __wbindgen_throw(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1))
      }
    }
  }).exports
}

let cachegetUint8Memory0 = null
function getUint8Memory0() {
  if (
    cachegetUint8Memory0 === null ||
    cachegetUint8Memory0.buffer !== wasm.memory.buffer
  ) {
    cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer)
  }
  return cachegetUint8Memory0
}

let WASM_VECTOR_LEN = 0

function passArray8ToWasm0(arg, malloc) {
  const ptr = malloc(arg.length * 1)
  getUint8Memory0().set(arg, ptr / 1)
  WASM_VECTOR_LEN = arg.length
  return ptr
}

function hash(msg, out) {
  try {
    var ptr0 = passArray8ToWasm0(msg, wasm.__wbindgen_malloc)
    var len0 = WASM_VECTOR_LEN
    var ptr1 = passArray8ToWasm0(out, wasm.__wbindgen_malloc)
    var len1 = WASM_VECTOR_LEN
    wasm.hash(ptr0, len0, ptr1, len1)
  } finally {
    out.set(getUint8Memory0().subarray(ptr1 / 1, ptr1 / 1 + len1))
    wasm.__wbindgen_free(ptr1, len1 * 1)
  }
}

function hash256hex(msg) {
  const out = new Uint8Array(32)
  hash(msg, out)
  return out.reduce(
    (hex, byte) => hex + (byte < 16 ? '0' : '') + byte.toString(16),
    ''
  )
}

;// CONCATENATED MODULE: ./index.ts






const blake3hash256hex = hash256hex;
async function blake3() {
    await init();
    return hash256hex;
}

module.exports = __webpack_exports__;
/******/ })()
;