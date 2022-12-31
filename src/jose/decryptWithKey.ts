import * as jose from "jose";

import { getKey } from "../util";

import { PrivateKey } from "../types/PrivateKey";

import { CompactJsonWebEncryption } from "../types/CompactJsonWebEncryption";
import { SuccessfulDecryption } from "../types/SuccessfulDecryption";

export type Decrypt = {
  jwe: CompactJsonWebEncryption | string;
  privateKey: PrivateKey;
};
export const decryptWithKey = async ({
  jwe,
  privateKey,
}: Decrypt): Promise<SuccessfulDecryption> => {
  const key = await getKey(privateKey);
  const { plaintext, protectedHeader } = await jose.compactDecrypt(jwe, key);
  return { plaintext, protectedHeader } as SuccessfulDecryption;
};
