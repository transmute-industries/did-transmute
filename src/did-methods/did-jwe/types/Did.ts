export type MethodSpecificIdentifier = string;

export type DidJwtMethodName = "jwe";

export type DidJwe = `did:${DidJwtMethodName}:${MethodSpecificIdentifier}`;

export type DidJweActor = {
  did: DidJwe;
};
