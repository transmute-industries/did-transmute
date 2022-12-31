import { verifyWithKey } from "./verifyWithKey";

import { PublicKey } from "../../../types/PublicKey";
import { DidJws } from "../../../types/DidJws";
import { CompactJsonWebSignature } from "../../../types/CompactJsonWebSignature";

export type Verify = {
  did: DidJws;
  publicKey: PublicKey;
};

export const verify = async ({ did, publicKey }: Verify) => {
  const jws = did.split(":").pop() as CompactJsonWebSignature;
  return verifyWithKey(jws, publicKey);
};
