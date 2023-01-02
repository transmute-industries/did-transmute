import { DidDocument } from "./DidDocument";
import { DidPath, DidQuery, DidFragment } from "./DidUrl";
import { Service } from "./Service";
import { VerificationMethod } from "./VerificationMethod";

import { ExportableKey } from "./ExportableKey";
export type DidWebMethodName = "web";
import { GenericResolver } from "./GenericResolver";

export type DidWeb = `did:${DidWebMethodName}:${string}`;
export type DidWebUrl = `${DidWeb}${DidPath}${DidQuery}${DidFragment}`;

export type DidWebResolver = (parameters: {
  did: DidWeb;
  resolver: GenericResolver;
}) => Promise<DidDocument | VerificationMethod | Service | null>;

export type DidWebDereference = (parameters: {
  didUrl: DidWebUrl;
  resolver: DidWebResolver;
}) => Promise<DidDocument | VerificationMethod | Service | null>;

export type DidWebActor = {
  did: DidWeb;
  didDocument: DidDocument;
  keys?: ExportableKey[];
};
