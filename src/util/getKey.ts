import * as jose from "jose";

export const getKey = async (data: any): Promise<jose.KeyLike> => {
  let key = data;
  if (key.kty) {
    key = await jose.importJWK(data);
  }
  return key as jose.KeyLike;
};
