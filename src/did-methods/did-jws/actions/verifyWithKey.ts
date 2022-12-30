import * as jose from "jose";
import { PublicKeyJwk } from "../../did-jwk/types/JsonWebKey";

import {
  CompactJsonWebSignature,
  SuccessfulVerification,
} from "../types/JsonWebSignature";

export const verifyWithKey = async (
  jws: CompactJsonWebSignature,
  publicKeyJwk: PublicKeyJwk
): Promise<SuccessfulVerification> => {
  const publicKey = await jose.importJWK(publicKeyJwk);
  const { payload, protectedHeader } = await jose.compactVerify(jws, publicKey);
  return { payload, protectedHeader } as SuccessfulVerification;
};
