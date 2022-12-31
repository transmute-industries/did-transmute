import { Context } from "./Context";
import { Did } from "./Did";
import { DidUrl } from "./DidUrl";
import { VerificationMethod } from "./VerificationMethod";

export type DidDocument = {
  "@context"?: Context | Array<Context>;
  id: Did;
  verificationMethod?: Array<VerificationMethod>;
  authentication?: Array<DidUrl>;
  assertionMethod?: Array<DidUrl>;
  capabilityInvocation?: Array<DidUrl>;
  capabilityDelegation?: Array<DidUrl>;
  keyAgreement?: Array<DidUrl>;
  [propertyName: string]: unknown;
};
