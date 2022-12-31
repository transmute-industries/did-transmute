export type Authentication = "authentication";
export type AssertionMethod = "assertionMethod";
export type CapabilityInvocation = "capabilityInvocation";
export type CapabilityDelegation = "capabilityDelegation";

export type SignatureRelationships =
  | Authentication
  | AssertionMethod
  | CapabilityInvocation
  | CapabilityDelegation;
