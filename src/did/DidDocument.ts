import { AnyDid } from "./Did";
import { AnyDidUrl } from "./DidUrl";
import { Context } from "./Context";
import { AnyVerificationMethod } from "./VerificationMethod";
import { Service } from "./Service";
export type AnyDidDocument = {
  "@context"?: Context | Array<Context>;
  id: AnyDid;
  verificationMethod?: Array<AnyVerificationMethod>;
  authentication?: Array<AnyDidUrl>;
  assertionMethod?: Array<AnyDidUrl>;
  capabilityInvocation?: Array<AnyDidUrl>;
  capabilityDelegation?: Array<AnyDidUrl>;
  keyAgreement?: Array<AnyDidUrl>;
  service?: Array<Service<AnyDidUrl>>;
  [property: string]: unknown;
};
