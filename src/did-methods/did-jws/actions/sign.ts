import { ProtectedHeader } from "../types/JsonWebSignature";
import { PrivateKeyJwk } from "../../did-jwk/types/JsonWebKey";

import { signWithKey } from "./signWithKey";
import { prefix } from "../method";
import { DidJws, DidJwsActor } from "../types/Did";

export type Sign = {
  header: ProtectedHeader;
  payload: Uint8Array;
  privateKey: CryptoKey | PrivateKeyJwk;
};

export const sign = async ({ header, payload, privateKey }: Sign) => {
  const jws = await signWithKey(payload, privateKey, header);
  const did = `${prefix}:${jws}` as DidJws;
  return { did: did } as DidJwsActor;
};
