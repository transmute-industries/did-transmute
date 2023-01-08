import { SignatureRelationships } from "../did/SignatureRelationships";

import { EncryptionRelationships } from "../did/EncryptionRelationships";

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
