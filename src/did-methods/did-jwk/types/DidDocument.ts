import { PublicKeyJwk } from "./JsonWebKey";
export type Context = string | object;
export type MethodName = "jwk";
export type MethodSpecificIdentifier = string;
export type DidPath = string;
export type DidQuery = string;
export type DidFragment = string;
export type Did = `did:${MethodName}:${MethodSpecificIdentifier}`;
export type DidUrl = `${Did}`;

export type DidUrlObject = {
  did: Did;
  path: DidPath;
  query: DidPath;
  fragment: DidPath;
};
export type VerificationMethod = {
  id: DidUrl;
  type: "JsonWebKey2020";
  controller: Did;
  publicKeyJwk: PublicKeyJwk;
};

export type Authentication = "authentication";
export type AssertionMethod = "assertionMethod";
export type CapabilityInvocation = "capabilityInvocation";
export type CapabilityDelegation = "capabilityDelegation";
export type KeyAgreement = "keyAgreement";

export type SignatureRelationships =
  | Authentication
  | AssertionMethod
  | CapabilityInvocation
  | CapabilityDelegation;

export type EncryptionRelationships = KeyAgreement;

export type VerificationRelationship =
  | SignatureRelationships
  | EncryptionRelationships;

export type DidDocument = {
  "@context": Context | Array<Context>;
  id: Did;
  verificationMethod: Array<VerificationMethod>;
  authentication: Array<DidUrl>;
  assertionMethod: Array<DidUrl>;
  capabilityInvocation: Array<DidUrl>;
  capabilityDelegation: Array<DidUrl>;
  keyAgreement: Array<DidUrl>;
};
