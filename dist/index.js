export * from "./defs";
export * from "./metadata";
export * from "./license";
export * from "./mime";
export * from "./ipfs";
import { init, hash256hex } from "blake3-hash-wasm/index";
export const blake3hash256hex = hash256hex;
export async function blake3() {
    await init();
    return hash256hex;
}
