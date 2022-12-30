import * as jose from "jose";

import {
  CompactJsonWebToken,
  SuccessfulVerification,
} from "../../did-jwt/types/JsonWebToken";

import { DidJwt } from "../types";
import { getKey } from "../../../util/getKey";
import { PublicKeyJwk } from "../../../types";

export type Verify = {
  did: DidJwt;
  issuer: string;
  audience?: string | string[];
  publicKey: PublicKeyJwk;
};

export const verify = async ({
  did,
  issuer,
  audience,
  publicKey,
}: Verify): Promise<SuccessfulVerification> => {
  const jwt = did.split(":").pop() as CompactJsonWebToken;
  const key = await getKey(publicKey);
  const options: jose.JWTVerifyOptions = {
    issuer,
  };
  if (audience) {
    options.audience = audience;
  }
  const { payload, protectedHeader } = await jose.jwtVerify(jwt, key, options);
  return { payload, protectedHeader } as SuccessfulVerification;
};
