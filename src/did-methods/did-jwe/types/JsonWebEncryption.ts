import { KeyAgreementAlgorithm, EncryptionAlgorithm } from "./Algorithm";

import { PublicKeyJwk } from "../../did-jwk/types/JsonWebKey";
export type EncodedProtectedHeader = string;
export type EncryptedKey = string;
export type InitializationVector = string;
export type CypherText = string;
export type AuthenticationTag = string;

export type CompactJsonWebEncryption =
  `${EncodedProtectedHeader}.${EncryptedKey}.${InitializationVector}.${CypherText}.${AuthenticationTag}`;

export type ProtectedHeader = {
  alg: KeyAgreementAlgorithm;
  enc: EncryptionAlgorithm;
  epk: PublicKeyJwk;
  [x: string]: unknown;
};

export type SuccessfulDecryption = {
  plaintext: Uint8Array;
  protectedHeader: ProtectedHeader;
};
