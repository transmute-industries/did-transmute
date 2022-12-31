import * as jose from "jose";

import { PrivateKey } from "../../../types/PrivateKey";
import { getKey } from "../../../util";

import { ProtectedHeader } from "../../../types/ProtectedHeader";

import { CompactJsonWebSignature } from "../../../types/CompactJsonWebSignature";

export const signWithKey = async (
  payload: Uint8Array,
  privateKey: PrivateKey,
  header: ProtectedHeader
): Promise<CompactJsonWebSignature> => {
  const key = await getKey(privateKey);
  const jws = await new jose.CompactSign(payload)
    .setProtectedHeader(header)
    .sign(key);
  return jws as CompactJsonWebSignature;
};
