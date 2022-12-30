import * as jose from "jose";

import {
  CompactJsonWebToken,
  SuccessfulVerification,
} from "../../did-jwt/types/JsonWebToken";

import { DidJwt } from "../types";
import { getKey } from "../../../util/getKey";

export type Decrypt = {
  did: DidJwt;
  issuer: any;
  verifier: any;
  privateKey: any;
};

export const decrypt = async ({
  did,
  issuer,
  verifier,
  privateKey,
}: Decrypt): Promise<SuccessfulVerification> => {
  const jwt = did.split(":").pop() as CompactJsonWebToken;
  const key = await getKey(privateKey);
  const { payload, protectedHeader } = await jose.jwtDecrypt(jwt, key, {
    issuer,
    audience: verifier,
  });
  return { payload, protectedHeader } as SuccessfulVerification;
};
