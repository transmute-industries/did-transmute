/* eslint-disable @typescript-eslint/no-unused-vars */
import { JsonWebKey, PublicKeyJwk } from "./types/JsonWebKey";
import { getPublicOperationsFromPrivate } from "./getPublicOperationsFromPrivate";
export const getPublicKeyJwk = (jwk: JsonWebKey): PublicKeyJwk => {
  const { d, p, q, dp, dq, qi, key_ops, ...publicKeyJwk } = jwk;
  if (d && key_ops) {
    publicKeyJwk.key_ops = getPublicOperationsFromPrivate(key_ops);
  }
  return publicKeyJwk as PublicKeyJwk;
};
