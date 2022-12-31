import { JWK } from "jose";
import { calculateJwkThumbprintUri } from "./calculateJwkThumbprintUri";

export const calculateJwkThumbprint = async (jwk: JWK) => {
  const kid = await calculateJwkThumbprintUri(jwk);
  return kid.split(":").pop();
};
