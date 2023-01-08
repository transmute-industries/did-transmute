import { Did } from "../did/Did";
import { DidUrl } from "../did/DidUrl";
import { Context } from "../did/Context";
import { ParsedDidUrl } from "../did/ParsedDidUrl";
import { DidResolutionParameters } from "../did/DidResolutionParameters";
import { DidDereferenceParameters } from "../did/DidDereferenceParameters";
import { VerificationMethod } from "../did/VerificationMethod";

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
