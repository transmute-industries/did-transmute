export type MethodSpecificIdentifier = string;

export type DidJwtMethodName = "jws";

export type DidJws = `did:${DidJwtMethodName}:${MethodSpecificIdentifier}`;

export type DidJwsActor = {
  did: DidJws;
};
