import { ExportableActor, IsolatedActor } from "../../types";
import { Algorithm } from "../../types/Algorithm";
import { generateKeyPair } from "../generateKeyPair";
import { toDid } from "../toDid";

import { DidJwk } from "../types";
export type Generate = {
  alg: Algorithm;
  extractable: boolean;
};

export const generate = async ({ alg, extractable }: Generate) => {
  const key = await generateKeyPair({ alg, extractable });
  const did = toDid(key.publicKeyJwk);
  const actor = { did, key };
  return extractable
    ? (actor as ExportableActor<DidJwk>)
    : (actor as IsolatedActor<DidJwk>);
};
