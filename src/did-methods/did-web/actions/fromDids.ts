import { DidJwk, DidJwkResolver } from "../../../types";

import { toDidDocument } from "../toDidDocument";

import { DidWebActor } from "../../../types/DidWeb";

export type FromDids = {
  url: string;
  dids: DidJwk[];
  resolver: DidJwkResolver;
};

export const fromDids = async ({
  url,
  dids,
  resolver,
}: FromDids): Promise<DidWebActor> => {
  const didDocument = await toDidDocument(url, dids, resolver);
  return { did: didDocument.id, didDocument } as DidWebActor;
};
