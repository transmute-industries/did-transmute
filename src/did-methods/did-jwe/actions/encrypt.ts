import { prefix } from "../method";
import { PublicKey } from "../../../types/PublicKey";
import { encryptToKey } from "./encryptToKey";

import { DidJwe, DidJweActor } from "../../../types/DidJwe";

export type Encrypt = {
  plaintext: Uint8Array;
  publicKey: PublicKey;
};

export const encrypt = async ({ plaintext, publicKey }: Encrypt) => {
  const jws = await encryptToKey(plaintext, publicKey);
  const did = `${prefix}:${jws}` as DidJwe;
  return { did: did } as DidJweActor;
};
