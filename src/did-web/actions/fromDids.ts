import { toDidDocument } from "../toDidDocument";

export type FromDids = {
  url: string;
  dids: any[];
  documentLoader: any;
};

export const fromDids = async ({
  url,
  dids,
  documentLoader,
}: FromDids): Promise<any> => {
  const didDocument = await toDidDocument(url, dids, documentLoader);
  return { did: didDocument.id, didDocument } as any;
};
