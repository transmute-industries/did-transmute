import { Did } from "../did/Did";
import { DidUrl } from "../types";
import { DocumentLoader } from "../types";

import { Algorithm } from "../jose/Algorithm";
import { PrivateKeyJwk } from "../jose/PrivateKeyJwk";

import { ExportableKey } from "../types";
export type DidWeb = Did<`did:web:${string}`>;

export type DidWebUrl = DidUrl<DidWeb>;

export type DidWebResolveParams = {
  id: DidWebUrl;
  documentLoader: DocumentLoader<string>;
};

export type DidWebResolver = (
  params: DidWebResolveParams
) => Promise<Record<string, unknown> | null>;

export type DidWebDereferenceParams = {
  id: DidWebUrl;
  documentLoader: DocumentLoader<string>;
};

export type DidWebDereferencer = (
  params: DidWebDereferenceParams
) => Promise<Record<string, unknown> | null>;

export type CreateExportable = {
  url: string;
  alg: Algorithm;
  documentLoader: DocumentLoader<string>;
};

export type DidWebActor = {
  did: DidWeb;
  didDocument: Record<string, unknown>;
};

export type ExportableDidWebActor = DidWebActor & {
  key: ExportableKey;
};

export type CreateFromDids = {
  url: string;
  dids: string[];
  documentLoader: DocumentLoader<string>;
};

export type CreateFromPrivateKey = {
  url: string;
  privateKey: PrivateKeyJwk;
};
