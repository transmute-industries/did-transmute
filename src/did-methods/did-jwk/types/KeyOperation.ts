import { Algorithm } from "./Algorithm";

// https://www.rfc-editor.org/rfc/rfc7517.html#section-4.3
export type Sign = "sign";
export type Verify = "verify";
export type Encrypt = "encrypt";
export type Decrypt = "decrypt";
export type WrapKey = "wrapKey";
export type UnwrapKey = "unwrapKey";
export type DeriveKey = "deriveKey";
export type DeriveBits = "deriveBits";
export type KeyOperation =
  | Sign
  | Verify
  | Encrypt
  | Decrypt
  | WrapKey
  | UnwrapKey
  | DeriveKey
  | DeriveBits;

export type Recommended = Record<KeyOperation, Algorithm>;
