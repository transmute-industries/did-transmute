import { Context } from "./Context";
import { AnyVerificationMethod } from "./VerificationMethod";
import { Service } from "./Service";
export type AnyDidDocument = {
  "@context"?: Context | Array<Context>;
  id: string;
  verificationMethod?: Array<AnyVerificationMethod>;
  authentication?: Array<string>;
  assertionMethod?: Array<string>;
  capabilityInvocation?: Array<string>;
  capabilityDelegation?: Array<string>;
  keyAgreement?: Array<string>;
  service?: Array<Service<string>>;
  [property: string]: unknown;
};
