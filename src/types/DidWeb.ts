import { DidDocument } from "./DidDocument";
import { DidPath, DidQuery, DidFragment } from "./DidUrl";
import { Service } from "./Service";
import { VerificationMethod } from "./VerificationMethod";

import { ExportableKey } from "./ExportableKey";
export type DidWebMethodName = "web";
import { GenericDocumentLoader } from "./GenericDocumentLoader";
import { DidJwk } from "./DidJwk";
import { DidJwt } from "./DidJwt";

export type DidWeb = `did:${DidWebMethodName}:${string}`;
export type DidWebUrl = `${DidWeb}${DidPath}${DidQuery}${DidFragment}`;

export type DidWebResolver = (parameters: {
  did: DidWeb;
  documentLoader: GenericDocumentLoader;
}) => Promise<DidDocument | VerificationMethod | Service | null>;

export type DidWebDereference = (parameters: {
  didUrl: DidWebUrl;
  resolver: DidWebResolver;
}) => Promise<DidDocument | VerificationMethod | Service | null>;

export type DidWebActor = {
  did: DidWeb;
  didDocument: DidDocument;
  key: ExportableKey;
};

export type DidWebDelegateType = DidJwk | DidJwt;

export type DidWebDelegateResolver = (parameters: {
  did: DidWebDelegateType;
  resolver: DidWebDelegateResolver;
}) => Promise<DidDocument | null>;
