import { SignatureRelationships } from "./../../types/SignatureRelationships";

import { EncryptionRelationships } from "./../../types/EncryptionRelationships";

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
