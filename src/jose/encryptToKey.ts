import * as jose from "jose";

import { getKey } from "./getKey";
import { PublicKey } from "./PublicKey";
import { CompactJsonWebEncryption } from "./CompactJsonWebEncryption";

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
