import { Algorithm } from "../../../types/Algorithm";
import { generateKeyPair } from "../generateKeyPair";
import { toDid } from "../toDid";

export type Generate = {
  alg: Algorithm;
  extractable: boolean;
};

export const generate = async ({ alg, extractable }: Generate) => {
  const key = await generateKeyPair({ alg, extractable });
  const did = toDid(key.publicKeyJwk);
  return { did, key };
};
