import * as jose from "jose";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getKey = async (data: any): Promise<jose.KeyLike> => {
  return data.kty ? jose.importJWK(data) : data;
};
