import * as jose from "jose";
import { PublicKey } from "../types/PublicKey";
import { getKey } from "../util";

import { CompactJsonWebSignature } from "../types/CompactJsonWebSignature";
import { SuccessfulVerification } from "../types/SuccessfulVerification";

export type Verify = {
  jws: CompactJsonWebSignature;
  publicKey: PublicKey;
};

export const verifyWithKey = async ({
  jws,
  publicKey,
}: Verify): Promise<SuccessfulVerification> => {
  const key = await getKey(publicKey);
  const { payload, protectedHeader } = await jose.compactVerify(jws, key);
  return { payload, protectedHeader } as SuccessfulVerification;
};
