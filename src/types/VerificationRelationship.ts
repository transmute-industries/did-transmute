import { SignatureRelationships } from "./SignatureRelationships";
import { EncryptionRelationships } from "./EncryptionRelationships";

export type VerificationRelationship =
  | SignatureRelationships
  | EncryptionRelationships;
