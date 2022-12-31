import { CompactJsonWebToken } from "./CompactJsonWebToken";
import { DidPath, DidQuery, DidFragment } from "./DidUrl";

export type DidJwsMethodName = "jws";
export type MethodSpecificIdentifier = CompactJsonWebToken;
export type DidJws = `did:${DidJwsMethodName}:${MethodSpecificIdentifier}`;
export type DidJwsUrl = `${DidJws}${DidPath}${DidQuery}${DidFragment}`;

export type DidJwsActor = {
  did: DidJws;
};
