import * as jose from "jose";

import { getKey } from "../util";
import { PublicKey } from "../types/PublicKey";
import { CompactJsonWebEncryption } from "../types/CompactJsonWebEncryption";

export type Encrypt = {
  publicKey: PublicKey;
  plaintext: Uint8Array;
  protectedHeader: jose.CompactJWEHeaderParameters;
};

export const encryptToKey = async ({
  publicKey,
  plaintext,
  protectedHeader,
}: Encrypt): Promise<CompactJsonWebEncryption> => {
  const key = await getKey(publicKey);
  const jwe = await new jose.CompactEncrypt(plaintext)
    .setProtectedHeader(protectedHeader)
    .encrypt(key);
  return jwe as CompactJsonWebEncryption;
};
