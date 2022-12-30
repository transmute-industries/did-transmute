import { prefix } from "../method";
import { PublicKeyJwk } from "../../did-jwk/types/JsonWebKey";
import { encryptToKey } from "./encryptToKey";

export type Create = {
  plaintext: Uint8Array;
  publicKey: PublicKeyJwk;
};

export const create = async ({ plaintext, publicKey }: Create) => {
  const jws = await encryptToKey(plaintext, publicKey);
  const did = `${prefix}:${jws}`;
  return { did: did };
};
