import * as jose from "jose";

import { getKey } from "../../jose/getKey";
import { PrivateKey } from "../../jose/PrivateKey";
import { SuccessfulTokenVerification } from "../../jose/SuccessfulTokenVerification";

import { DidJweJwt } from "../types";

import { parseDidUrl } from "../../did/parseDidUrl";

export type Decrypt = {
  did: DidJweJwt;
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
  const parsed = parseDidUrl(did);
  const jwt = parsed.id;
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
