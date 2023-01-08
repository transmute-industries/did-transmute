/* eslint-disable @typescript-eslint/no-unused-vars */
import { PrivateKeyJwk } from "../jose/PrivateKeyJwk";
import { PublicKeyJwk } from "../jose/PublicKeyJwk";
import { getPublicOperationsFromPrivate } from "./getPublicOperationsFromPrivate";
export const getPublicKeyJwk = (jwk: PrivateKeyJwk): PublicKeyJwk => {
  const { d, p, q, dp, dq, qi, key_ops, ...publicKeyJwk } = jwk;
  if (d && key_ops) {
    publicKeyJwk.key_ops = getPublicOperationsFromPrivate(key_ops);
  }
  return publicKeyJwk;
};
