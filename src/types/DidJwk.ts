import { DidPath, DidQuery, DidFragment } from "./DidUrl";
import { DidDocument } from "./DidDocument";
import { VerificationMethod } from "./VerificationMethod";
import { Service } from "./Service";

export type Base64UrlEncodedPublicKeyJwk = string;
export type DidJwkMethodName = "jwk";
export type DidJwk = `did:${DidJwkMethodName}:${Base64UrlEncodedPublicKeyJwk}`;
export type DidJwkUrl = `${DidJwk}${DidPath}${DidQuery}${DidFragment}`;

export type DidJwkResolver = (parameters: {
  did: DidJwk;
}) => Promise<DidDocument | null>;

export type DidJwkDereference = (parameters: {
  didUrl: DidJwkUrl;
  resolver: DidJwkResolver;
}) => Promise<DidDocument | VerificationMethod | Service | null>;

export type DidJwkActor = {
  did: DidJwk;
};
