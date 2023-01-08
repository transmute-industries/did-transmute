import * as jose from "jose";

import { AsymmetricJsonWebKey } from "../jose/AsymmetricJsonWebKey";

import { getPublicKeyJwk } from "./getPublicKeyJwk";
import { prefix } from "./method";
import { DidJwk } from "./types";

export const toDid = (jwk: AsymmetricJsonWebKey): DidJwk => {
  const publicKeyJwk = getPublicKeyJwk(jwk);
  const id = jose.base64url.encode(JSON.stringify(publicKeyJwk));
  const did = `${prefix}:${id}` as DidJwk;
  return did;
};
