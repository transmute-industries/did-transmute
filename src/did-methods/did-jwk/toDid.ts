import * as jose from "jose";
import { Did } from "./types/DidDocument";
import { JsonWebKey } from "./types/JsonWebKey";

import * as method from "./method";

export const toDid = (jwk: JsonWebKey, methodPrefix = method.prefix): Did => {
  // @typescript-eslint/no-unused-vars
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { d, p, q, dp, dq, qi, ...publicKeyJwk } = jwk;
  const id = jose.base64url.encode(JSON.stringify(publicKeyJwk));
  const did = `${methodPrefix}:${id}`;
  return did as Did;
};
