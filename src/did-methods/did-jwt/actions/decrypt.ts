import * as jose from "jose";

import {
  CompactJsonWebToken,
  SuccessfulVerification,
} from "../../did-jwt/types/JsonWebToken";

import { DidJwt } from "../types";
import { getKey } from "../../../util/getKey";
import { PrivateKeyJwk } from "../../../types";

export type Decrypt = {
  did: DidJwt;
  issuer: string;
  audience?: string | string[];
  privateKey: PrivateKeyJwk;
};

export const decrypt = async ({
  did,
  issuer,
  audience,
  privateKey,
}: Decrypt): Promise<SuccessfulVerification> => {
  const jwt = did.split(":").pop() as CompactJsonWebToken;
  const options: jose.JWTDecryptOptions = {
    issuer,
  };
  if (audience) {
    options.audience = audience;
  }
  const key = await getKey(privateKey);
  const { payload, protectedHeader } = await jose.jwtDecrypt(jwt, key, options);
  return { payload, protectedHeader } as SuccessfulVerification;
};
