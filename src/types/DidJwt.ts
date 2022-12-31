import { CompactJsonWebToken } from "./CompactJsonWebToken";
import { DidPath, DidQuery, DidFragment } from "./DidUrl";

export type DidJwtMethodName = "jwt";
export type MethodSpecificIdentifier = CompactJsonWebToken;
export type DidJwt = `did:${DidJwtMethodName}:${MethodSpecificIdentifier}`;
export type DidJwtUrl = `${DidJwt}${DidPath}${DidQuery}${DidFragment}`;

export type DidJwtActor = {
  did: DidJwt;
};
