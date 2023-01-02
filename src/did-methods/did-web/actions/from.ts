import { DidJwk, DidJwkResolver } from "../../../types";

import { toDidDocument } from "../toDidDocument";

import { DidWebActor } from "../../../types/DidWeb";

export type From = {
  url: string;
  dids: DidJwk[];
  resolver: DidJwkResolver;
};

export const from = async ({
  url,
  dids,
  resolver,
}: From): Promise<DidWebActor> => {
  const didDocument = await toDidDocument(url, dids, resolver);
  return { did: didDocument.id, didDocument } as DidWebActor;
};
