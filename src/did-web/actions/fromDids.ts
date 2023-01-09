import { toDidDocument } from "../toDidDocument";

import { DidWebActor, CreateFromDids } from "../types";

export const fromDids = async ({
  url,
  dids,
  documentLoader,
}: CreateFromDids): Promise<DidWebActor> => {
  const didDocument = await toDidDocument(url, dids, documentLoader);
  return { did: didDocument.id, didDocument } as DidWebActor;
};
