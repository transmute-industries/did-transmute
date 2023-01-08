import * as jose from "jose";

import { getKey } from "./getKey";

import { ProtectedHeader } from "./ProtectedHeader";
import { CompactJsonWebSignature } from "./CompactJsonWebSignature";
import { PrivateKey } from "./PrivateKey";

export type Sign = {
  payload: Uint8Array;
  privateKey: PrivateKey;
  protectedHeader: ProtectedHeader;
};

export const signWithKey = async ({
  privateKey,
  payload,
  protectedHeader,
}: Sign): Promise<CompactJsonWebSignature> => {
  const key = await getKey(privateKey);
  const jws = await new jose.CompactSign(payload)
    .setProtectedHeader(protectedHeader)
    .sign(key);
  return jws as CompactJsonWebSignature;
};
