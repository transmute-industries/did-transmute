import { Did } from "../types/Did";
import { DidUrl } from "../types/DidUrl";
import { Context } from "../types/Context";
import { ParsedDidUrl } from "../types/ParsedDidUrl";
import { DidResolutionParameters } from "../types/DidResolutionParameters";
import { DidDereferenceParameters } from "../types/DidDereferenceParameters";
import { VerificationMethod } from "../types/VerificationMethod";

export type DidJwk = Did<`did:jwk:${string}`>;
export type DidJwkUrl = DidUrl<`${DidJwk}#0`>;

export type DidJwkVerificationMethod = VerificationMethod<DidJwkUrl>;

export type DidJwkVerificationRelationship = Array<
  ParsedDidUrl<DidJwkUrl>["fragment"]
>;

export type DidJwkDocument = {
  "@context": Array<Context>;
  id: Did<DidJwk>;
  verificationMethod: Array<DidJwkVerificationMethod>;
  authentication?: DidJwkVerificationRelationship;
  assertionMethod?: DidJwkVerificationRelationship;
  capabilityInvocation?: DidJwkVerificationRelationship;
  capabilityDelegation?: DidJwkVerificationRelationship;
  keyAgreement?: DidJwkVerificationRelationship;
};

export type DidJwkResolutionParameters = DidResolutionParameters<DidJwk>;
export type DidJwkDereferenceParameters = DidDereferenceParameters<DidJwkUrl>;
