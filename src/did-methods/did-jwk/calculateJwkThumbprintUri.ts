import jose from "jose";
import { PublicKeyJwk } from "./types/JsonWebKey";

export const calculateJwkThumbprintUri = async (publicKeyJwk: PublicKeyJwk) => {
  const kid = await jose.calculateJwkThumbprintUri(publicKeyJwk);
  return kid;
};
