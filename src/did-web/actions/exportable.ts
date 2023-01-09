import { generate } from "../../did-jwk/actions/generate";
import { toDid } from "../../did-jwk/toDid";

import { toDidDocument } from "../toDidDocument";

import { CreateExportable, ExportableDidWebActor } from "../types";

export const exportable = async ({
  url,
  alg,
  documentLoader,
}: CreateExportable): Promise<ExportableDidWebActor> => {
  const { key } = await generate({ alg, extractable: true });
  const didJwk = toDid(key.publicKey);
  const didDocument = await toDidDocument(url, [didJwk], documentLoader);
  return { did: didDocument.id, didDocument, key } as ExportableDidWebActor;
};
