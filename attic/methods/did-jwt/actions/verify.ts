import * as jose from "jose";

import { getKey } from "../../../util/getKey";
import { PublicKey } from "../../../types/PublicKey";

import { DidJwt } from "../../../types/DidJwt";
import { CompactJsonWebToken } from "../../../types/CompactJsonWebToken";
import { SuccessfulTokenVerification } from "../../../types/SuccessfulTokenVerification";

export type Verify = {
  did: DidJwt;
  issuer: string;
  audience?: string | string[];
  publicKey: PublicKey;
};

export const verify = async ({
  did,
  issuer,
  audience,
  publicKey,
}: Verify): Promise<SuccessfulTokenVerification> => {
  const jwt = did.split(":").pop() as CompactJsonWebToken;
  const key = await getKey(publicKey);
  const options: jose.JWTVerifyOptions = {
    issuer,
  };
  if (audience) {
    options.audience = audience;
  }
  const { payload, protectedHeader } = await jose.jwtVerify(jwt, key, options);
  return { payload, protectedHeader } as SuccessfulTokenVerification;
};
