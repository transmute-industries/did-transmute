import { CompactJsonWebSignature } from "./CompactJsonWebSignature";
import { CompactJsonWebEncryption } from "./CompactJsonWebEncryption";

export type CompactJsonWebToken =
  | CompactJsonWebSignature
  | CompactJsonWebEncryption;
