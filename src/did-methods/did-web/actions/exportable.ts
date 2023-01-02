import { DidJwkResolver, ExportableActor } from "../../../types";
import { Algorithm } from "../../../types/Algorithm";
import { generate } from "../../did-jwk/actions/generate";
import { toDid } from "../../did-jwk/toDid";

import { toDidDocument } from "../toDidDocument";
export type Exportable = {
  url: string;
  alg: Algorithm;
  resolver: DidJwkResolver;
};

export const exportable = async ({
  url,
  alg,
  resolver,
}: Exportable): Promise<ExportableActor> => {
  const { key } = await generate({ alg, extractable: true });
  const didJwk = toDid(key.publicKeyJwk);
  const didDocument = await toDidDocument(url, [didJwk], resolver);
  return { did: didDocument.id, didDocument, key } as ExportableActor;
};
