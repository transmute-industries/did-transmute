import * as jose from "jose";
import { PublicKey } from "./PublicKey";
import { getKey } from "./getKey";

import { CompactJsonWebSignature } from "./CompactJsonWebSignature";
import { SuccessfulVerification } from "./SuccessfulVerification";

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
