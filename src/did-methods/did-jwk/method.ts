import {
  EncryptionRelationships,
  SignatureRelationships,
} from "./types/DidDocument";

export const prefix = "did:jwk";

export const signatureVerificationRelationships: SignatureRelationships[] = [
  "authentication",
  "assertionMethod",
  "capabilityInvocation",
  "capabilityDelegation",
];
export const encryptionVerificationRelationships: EncryptionRelationships[] = [
  "keyAgreement",
];
