// key agreement
export type ECDH_ES_A256KW = "ECDH-ES+A256KW";
export type RSA_OAEP_256 = "RSA-OAEP-256";
export type A256GCM = "A256GCM";

export type KeyAgreementAlgorithm = ECDH_ES_A256KW | RSA_OAEP_256;

// encryption
export type EncryptionAlgorithm = A256GCM;
