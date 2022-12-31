export type MethodSpecificIdentifier = string;

export type DidJwtMethodName = "jwt";

export type DidJwt = `did:${DidJwtMethodName}:${MethodSpecificIdentifier}`;

export type DidJwtUrl = DidJwt;

export type DidJwtActor = {
  did: DidJwt;
};
