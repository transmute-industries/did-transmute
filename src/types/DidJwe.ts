import { CompactJsonWebEncryption } from "./CompactJsonWebEncryption";
import { DidPath, DidQuery, DidFragment } from "./DidUrl";

export type DidJweMethodName = "jwe";
export type MethodSpecificIdentifier = CompactJsonWebEncryption;
export type DidJwe = `did:${DidJweMethodName}:${MethodSpecificIdentifier}`;
export type DidJweUrl = `${DidJwe}${DidPath}${DidQuery}${DidFragment}`;

export type DidJweActor = {
  did: DidJwe;
};
