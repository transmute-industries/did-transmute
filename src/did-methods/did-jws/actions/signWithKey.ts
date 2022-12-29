import * as jose from "jose";

import { PrivateKeyJwk } from "../../did-jwk/types/JsonWebKey";
import {
  ProtectedHeader,
  CompactJsonWebSignature,
} from "../types/JsonWebSignature";

export const signWithKey = async (
  payload: Uint8Array,
  privateKey: CryptoKey | PrivateKeyJwk,
  header: ProtectedHeader
): Promise<CompactJsonWebSignature> => {
  let key: jose.KeyLike | Uint8Array;
  if ((privateKey as PrivateKeyJwk).alg) {
    key = await jose.importJWK(privateKey as PrivateKeyJwk);
  } else {
    key = privateKey as jose.KeyLike;
  }
  const jws = await new jose.CompactSign(payload)
    .setProtectedHeader(header)
    .sign(key);
  return jws as CompactJsonWebSignature;
};
