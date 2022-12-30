import { ProtectedHeader } from "../types/JsonWebSignature";
import { PrivateKeyJwk } from "../../did-jwk/types/JsonWebKey";
export type Create = {
  header: ProtectedHeader;
  payload: Uint8Array;
  privateKey: CryptoKey | PrivateKeyJwk;
};

import { signWithKey } from "./signWithKey";

import { prefix } from "../method";

export const create = async ({ header, payload, privateKey }: Create) => {
  const jws = await signWithKey(payload, privateKey, header);
  const did = `${prefix}:${jws}`;
  return { did: did };
};
