import * as jose from "jose";

import { getKey } from "../util";

import { ProtectedHeader } from "../types/ProtectedHeader";
import { CompactJsonWebSignature } from "../types/CompactJsonWebSignature";
import { PrivateKey } from "../types/PrivateKey";

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
