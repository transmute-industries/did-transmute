import * as jose from "jose";

import { PrivateKeyJwk } from "../../did-jwk/types/JsonWebKey";

import {
  CompactJsonWebEncryption,
  SuccessfulDecryption,
} from "../types/JsonWebEncryption";

export const decryptWithKey = async (
  jwe: CompactJsonWebEncryption | string,
  privateKey: CryptoKey | PrivateKeyJwk
): Promise<SuccessfulDecryption> => {
  let key: jose.KeyLike | Uint8Array;
  if ((privateKey as PrivateKeyJwk).alg) {
    key = await jose.importJWK(privateKey as PrivateKeyJwk);
  } else {
    key = privateKey as jose.KeyLike;
  }
  const { plaintext, protectedHeader } = await jose.compactDecrypt(jwe, key);
  return { plaintext, protectedHeader } as SuccessfulDecryption;
};
