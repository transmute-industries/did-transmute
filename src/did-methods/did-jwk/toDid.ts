import * as jose from "jose";
import { Did } from "../../types/Did";

import { AsymmetricJsonWebKey } from "../../types/AsymmetricJsonWebKey";

import * as method from "./method";
import { getPublicKeyJwk } from "./getPublicKeyJwk";

export const toDid = (
  jwk: AsymmetricJsonWebKey,
  methodPrefix = method.prefix
): Did => {
  const publicKeyJwk = getPublicKeyJwk(jwk);
  const id = jose.base64url.encode(JSON.stringify(publicKeyJwk));
  const did = `${methodPrefix}:${id}`;
  return did as Did;
};
