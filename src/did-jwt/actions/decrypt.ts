import * as jose from "jose";

import { getKey } from "../../../util/getKey";
import { PrivateKey } from "../../../types/PrivateKey";
import { CompactJsonWebToken } from "../../../types/CompactJsonWebToken";
import { SuccessfulTokenVerification } from "../../../types/SuccessfulTokenVerification";
import { DidJwt } from "../../../types/DidJwt";

export type Decrypt = {
  did: DidJwt;
  issuer: string;
  audience?: string | string[];
  privateKey: PrivateKey;
};

export const decrypt = async ({
  did,
  issuer,
  audience,
  privateKey,
}: Decrypt): Promise<SuccessfulTokenVerification> => {
  const jwt = did.split(":").pop() as CompactJsonWebToken;
  const options: jose.JWTDecryptOptions = {
    issuer,
  };
  if (audience) {
    options.audience = audience;
  }
  const key = await getKey(privateKey);
  const { payload, protectedHeader } = await jose.jwtDecrypt(jwt, key, options);
  return { payload, protectedHeader } as SuccessfulTokenVerification;
};
