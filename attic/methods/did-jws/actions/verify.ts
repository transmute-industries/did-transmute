import { PublicKey } from "../../../types/PublicKey";
import { DidJws } from "../../../types/DidJws";
import { CompactJsonWebSignature } from "../../../types/CompactJsonWebSignature";

import { verifyWithKey } from "../../../jose/verifyWithKey";

export type Verify = {
  did: DidJws;
  publicKey: PublicKey;
};

export const verify = async ({ did, publicKey }: Verify) => {
  const jws = did.split(":").pop() as CompactJsonWebSignature;
  return verifyWithKey({ jws, publicKey });
};
