import { formatVerificationMethod } from "./formatVerificationMethod";
import { DidDocument } from "../types";

export const formatDidDocument = (didDocument: DidDocument): DidDocument => {
  const {
    id,
    verificationMethod,
    authentication,
    assertionMethod,
    capabilityInvocation,
    capabilityDelegation,
    keyAgreement,
    service,
    ...rest
  } = didDocument;
  const formatted = {
    "@context": didDocument["@context"],
    id: id,
    verificationMethod: verificationMethod || [].map(formatVerificationMethod),
    authentication: authentication?.length ? authentication : undefined,
    assertionMethod: assertionMethod?.length ? assertionMethod : undefined,
    capabilityInvocation: capabilityInvocation?.length
      ? capabilityInvocation
      : undefined,
    capabilityDelegation: capabilityDelegation?.length
      ? capabilityDelegation
      : undefined,
    keyAgreement: keyAgreement?.length ? keyAgreement : undefined,
    service: service?.length ? service : undefined,
    ...rest,
  };
  return JSON.parse(JSON.stringify(formatted));
};
