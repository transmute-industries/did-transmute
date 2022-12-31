import { CompactJsonWebToken } from "./CompactJsonWebToken";
import { DidPath, DidQuery, DidFragment } from "./DidUrl";

export type DidJwtMethodName = "jwt";

export type DidJwt = `did:${DidJwtMethodName}:${CompactJsonWebToken}`;
export type DidJwtUrl = `${DidJwt}${DidPath}${DidQuery}${DidFragment}`;

export type DidJwtActor = {
  did: DidJwt;
};
