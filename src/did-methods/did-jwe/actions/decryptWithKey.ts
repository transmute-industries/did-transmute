import * as jose from "jose";

import { PrivateKeyJwk } from "../../did-jwk/types/JsonWebKey";

import {
  CompactJsonWebEncryption,
  SuccessfulDecryption,
} from "../types/JsonWebEncryption";

export const decryptWithKey = async (
  jwe: CompactJsonWebEncryption | string,
  privateKeyJwk: PrivateKeyJwk
): Promise<SuccessfulDecryption> => {
  const privateKey = await jose.importJWK(privateKeyJwk);
  const { plaintext, protectedHeader } = await jose.compactDecrypt(
    jwe,
    privateKey
  );
  return { plaintext, protectedHeader } as SuccessfulDecryption;
};
