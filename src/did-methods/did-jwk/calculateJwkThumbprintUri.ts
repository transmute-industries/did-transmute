import jose from "jose";

export const calculateJwkThumbprintUri = async (jwk: jose.JWK) => {
  const kid = await jose.calculateJwkThumbprintUri(jwk);
  return kid;
};
