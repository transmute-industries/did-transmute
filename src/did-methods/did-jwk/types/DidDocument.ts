export type MethodName = "jwk";
export type MethodSpecificIdentifier = string;

export type Did = `did:${MethodName}:${MethodSpecificIdentifier}` | string;
export type DidUrl = `${Did}`;

export type DidPath = string;
export type DidQuery = string;
export type DidFragment = string;
export type DidUrlObject = {
  did: Did;
  path: DidPath;
  query: DidPath;
  fragment: DidPath;
};
