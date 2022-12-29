import { SignatureAlgorithm } from "./Algorithm";
export type EncodedProtectedHeader = string;
export type EncodedPayload = string;
export type EncodedSignature = string;

export type CompactJsonWebSignature =
  `${EncodedProtectedHeader}.${EncodedPayload}.${EncodedSignature}`;

export type ProtectedHeader = {
  alg: SignatureAlgorithm;
  [x: string]: unknown;
};

export type SuccessfulVerification = {
  payload: Uint8Array;
  protectedHeader: ProtectedHeader;
};
