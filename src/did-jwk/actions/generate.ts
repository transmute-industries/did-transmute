import { Algorithm } from "../../jose/Algorithm";
import { generateKeyPair } from "../generateKeyPair";
import { toDid } from "../toDid";

import { ExportableDidJwkActor, IsolatedDidJwkActor } from "../types";

export type Generate = {
  alg: Algorithm;
  extractable: boolean;
};

export const generate = async ({ alg, extractable }: Generate) => {
  const key = await generateKeyPair({ alg, extractable });
  const did = toDid(key.publicKey);
  const actor = { did, key };
  return extractable
    ? (actor as ExportableDidJwkActor)
    : (actor as IsolatedDidJwkActor);
};
