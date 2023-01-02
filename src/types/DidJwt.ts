import { CompactJsonWebToken } from "./CompactJsonWebToken";
import { DidDocument } from "./DidDocument";
import { DidPath, DidQuery, DidFragment } from "./DidUrl";
import { Service } from "./Service";
import { VerificationMethod } from "./VerificationMethod";
import { DidJwkResolver } from "./DidJwk";
export type DidJwtMethodName = "jwt";

export type DidJwt = `did:${DidJwtMethodName}:${CompactJsonWebToken}`;
export type DidJwtUrl = `${DidJwt}${DidPath}${DidQuery}${DidFragment}`;

export type DidJwtResolver = (parameters: {
  did: DidJwt;
  resolver: DidJwkResolver;
}) => Promise<DidDocument | VerificationMethod | Service | null>;

export type DidJwtDereference = (parameters: {
  didUrl: DidJwtUrl;
  resolver: DidJwtResolver;
}) => Promise<DidDocument | VerificationMethod | Service | null>;

export type DidJwtActor = {
  did: DidJwt;
};
