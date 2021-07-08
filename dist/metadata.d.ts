import { LeaseLicenseMetadata, LeaseLicenseParams, ExclusiveLicenseParams, ExclusiveLicenseMetadata } from "./defs";
export declare function serializeMetadata(metadata: LeaseLicenseMetadata | ExclusiveLicenseMetadata): Uint8Array;
export declare function deserializeMetadata(buf: Uint8Array): LeaseLicenseMetadata | ExclusiveLicenseMetadata;
export declare function exclusiveLicenseMetadata(params: ExclusiveLicenseParams): ExclusiveLicenseMetadata;
export declare function leaseLicenseMetadata(params: LeaseLicenseParams): LeaseLicenseMetadata;
