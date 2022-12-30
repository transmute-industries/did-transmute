import * as jose from "jose";

import {
  PrivateKeyJwk,
  PublicKeyJwk,
} from "../did-methods/did-jwk/types/JsonWebKey";

export type KeyType =
  | CryptoKey
  | jose.KeyLike
  | Uint8Array
  | PrivateKeyJwk
  | PublicKeyJwk;

export const getKey = async (data: KeyType): Promise<jose.KeyLike> => {
  let key = data as any;
  if (key.alg) {
    key = await jose.importJWK(data as PrivateKeyJwk);
  }
  return key as jose.KeyLike;
};
