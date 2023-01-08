import { toDidDocument } from "../toDidDocument";

import {
  DidWebActor,
  DidWebDelegateType,
  DidWebDelegateResolver,
} from "../../../types/DidWeb";

export type FromDids = {
  url: string;
  dids: DidWebDelegateType[];
  resolver: DidWebDelegateResolver;
};

export const fromDids = async ({
  url,
  dids,
  resolver,
}: FromDids): Promise<DidWebActor> => {
  const didDocument = await toDidDocument(url, dids, resolver);
  return { did: didDocument.id, didDocument } as DidWebActor;
};
