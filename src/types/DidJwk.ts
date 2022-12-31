import { DidPath, DidQuery, DidFragment } from "./DidUrl";

export type Base64UrlEncodedPublicKeyJwk = string;
export type DidJwkMethodName = "jwk";
export type DidJwk = `did:${DidJwkMethodName}:${Base64UrlEncodedPublicKeyJwk}`;
export type DidJwkUrl = `${DidJwk}${DidPath}${DidQuery}${DidFragment}`;

export type DidJwkActor = {
  did: DidJwk;
};
