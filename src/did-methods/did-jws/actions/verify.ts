import { PublicKeyJwk } from "../../did-jwk/types/JsonWebKey";

import { verifyWithKey } from "./verifyWithKey";

import { DidJws } from "../types/Did";
import { CompactJsonWebSignature } from "../types/JsonWebSignature";

export type Verify = {
  did: DidJws;
  publicKey: PublicKeyJwk;
};

export const verify = async ({ did, publicKey }: Verify) => {
  const jws = did.split(":").pop() as CompactJsonWebSignature;
  return verifyWithKey(jws, publicKey);
};
