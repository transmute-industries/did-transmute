import * as jose from "jose";

import { AsymmetricJsonWebKey } from "../jose/AsymmetricJsonWebKey";

import * as method from "./method";
import { getPublicKeyJwk } from "./getPublicKeyJwk";

export const toDid = (
  jwk: AsymmetricJsonWebKey,
  methodPrefix = method.prefix
): any => {
  const publicKeyJwk = getPublicKeyJwk(jwk);
  const id = jose.base64url.encode(JSON.stringify(publicKeyJwk));
  const did = `${methodPrefix}:${id}`;
  return did as any;
};
