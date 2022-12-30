import { prefix } from "../method";
import { PublicKeyJwk } from "../../did-jwk/types/JsonWebKey";
import { encryptToKey } from "./encryptToKey";

import { DidJwe, DidJweActor } from "../types/Did";
export type Encrypt = {
  plaintext: Uint8Array;
  publicKey: PublicKeyJwk;
};

export const encrypt = async ({ plaintext, publicKey }: Encrypt) => {
  const jws = await encryptToKey(plaintext, publicKey);
  const did = `${prefix}:${jws}` as DidJwe;
  return { did: did } as DidJweActor;
};
