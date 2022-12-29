import { JsonWebKey } from "./types/JsonWebKey";

export const formatJwk = (jwk: JsonWebKey) => {
  const { kid, x5u, x5c, x5t, kty, crv, alg, key_ops, x, y, d, ...rest } = jwk;
  return JSON.parse(
    JSON.stringify({
      kid,
      x5u,
      x5c,
      x5t,
      kty,
      crv,
      alg,
      key_ops,
      x,
      y,
      d,
      ...rest,
    })
  );
};
