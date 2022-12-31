import { Context } from "./Context";
import { Did } from "./Did";
import { DidUrl } from "./DidUrl";
import { VerificationMethod } from "./VerificationMethod";
import { Service } from "./Service";

export type DidDocument = {
  "@context"?: Context | Array<Context>;
  id: Did;
  verificationMethod?: Array<VerificationMethod>;
  authentication?: Array<DidUrl>;
  assertionMethod?: Array<DidUrl>;
  capabilityInvocation?: Array<DidUrl>;
  capabilityDelegation?: Array<DidUrl>;
  keyAgreement?: Array<DidUrl>;
  service?: Array<Service>;
  [propertyName: string]: unknown;
};
