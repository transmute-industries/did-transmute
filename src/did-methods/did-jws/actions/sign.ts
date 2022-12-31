import { signWithKey } from "./signWithKey";
import { prefix } from "../method";

import { DidJws, DidJwsActor } from "../../../types/DidJws";
import { ProtectedHeader } from "../../../types/ProtectedHeader";
import { PrivateKey } from "../../../types/PrivateKey";

export type Sign = {
  header: ProtectedHeader;
  payload: Uint8Array;
  privateKey: PrivateKey;
};

export const sign = async ({ header, payload, privateKey }: Sign) => {
  const jws = await signWithKey(payload, privateKey, header);
  const did = `${prefix}:${jws}` as DidJws;
  return { did: did } as DidJwsActor;
};
