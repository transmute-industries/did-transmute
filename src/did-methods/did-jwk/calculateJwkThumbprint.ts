import { PublicKeyJwk } from "./types/JsonWebKey";

import { calculateJwkThumbprintUri } from "./calculateJwkThumbprintUri";

export const calculateJwkThumbprint = async (publicKeyJwk: PublicKeyJwk) => {
  const kid = await calculateJwkThumbprintUri(publicKeyJwk);
  return kid.split(":").pop();
};
