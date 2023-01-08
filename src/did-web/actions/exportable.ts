import { Algorithm } from "../../jose/Algorithm";

import { generate } from "../../did-jwk/actions/generate";
import { toDid } from "../../did-jwk/toDid";

import { toDidDocument } from "../toDidDocument";

export type Exportable = {
  url: string;
  alg: Algorithm;
  documentLoader: any;
};

export const exportable = async ({
  url,
  alg,
  documentLoader,
}: Exportable): Promise<any> => {
  const { key } = await generate({ alg, extractable: true });
  const didJwk = toDid(key.publicKey);
  const didDocument = await toDidDocument(url, [didJwk], documentLoader);
  return { did: didDocument.id, didDocument, key } as any;
};
