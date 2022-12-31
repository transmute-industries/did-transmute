export type EncodedProtectedHeader = string;
export type EncryptedKey = string;
export type InitializationVector = string;
export type CypherText = string;
export type AuthenticationTag = string;

export type CompactJsonWebEncryption =
  `${EncodedProtectedHeader}.${EncryptedKey}.${InitializationVector}.${CypherText}.${AuthenticationTag}`;
