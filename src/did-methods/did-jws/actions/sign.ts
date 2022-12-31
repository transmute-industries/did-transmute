import { prefix } from "../method";

import { DidJws, DidJwsActor } from "../../../types/DidJws";
import { ProtectedHeader } from "../../../types/ProtectedHeader";
import { PrivateKey } from "../../../types/PrivateKey";
import { signWithKey } from "../../../jose/signWithKey";

export type Sign = {
  privateKey: PrivateKey;
  payload: Uint8Array;
  protectedHeader: ProtectedHeader;
};

export const sign = async ({ privateKey, payload, protectedHeader }: Sign) => {
  const jws = await signWithKey({ privateKey, payload, protectedHeader });
  const did = `${prefix}:${jws}` as DidJws;
  return { did: did } as DidJwsActor;
};
