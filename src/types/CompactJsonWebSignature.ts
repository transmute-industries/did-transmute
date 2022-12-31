export type EncodedProtectedHeader = string;
export type EncodedPayload = string;
export type EncodedSignature = string;

export type CompactJsonWebSignature =
  `${EncodedProtectedHeader}.${EncodedPayload}.${EncodedSignature}`;
