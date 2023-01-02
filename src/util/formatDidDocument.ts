import { formatVerificationMethod } from "./formatVerificationMethod";
import { DidDocument } from "../types";

export const formatDidDocument = (didDocument: DidDocument): DidDocument => {
  const formatted = {
    "@context": didDocument["@context"],
    id: didDocument.id,
    verificationMethod:
      didDocument.verificationMethod || [].map(formatVerificationMethod),
    authentication: didDocument.authentication?.length
      ? didDocument.authentication
      : undefined,
    assertionMethod: didDocument.assertionMethod?.length
      ? didDocument.assertionMethod
      : undefined,
    capabilityInvocation: didDocument.capabilityInvocation?.length
      ? didDocument.capabilityInvocation
      : undefined,
    capabilityDelegation: didDocument.capabilityDelegation?.length
      ? didDocument.capabilityDelegation
      : undefined,
    keyAgreement: didDocument.keyAgreement?.length
      ? didDocument.keyAgreement
      : undefined,
  };
  return JSON.parse(JSON.stringify(formatted));
};
