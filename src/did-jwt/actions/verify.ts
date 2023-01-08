import * as jose from "jose";

import { getKey } from "../../jose/getKey";
import { PublicKey } from "../../jose/PublicKey";
import { SuccessfulTokenVerification } from "../../jose/SuccessfulTokenVerification";

import { parseDidUrl } from "../../did/parseDidUrl";
import { DidJwsJwt, CompactJws } from "../types";

export type Verify = {
  did: DidJwsJwt;
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
  const parsed = parseDidUrl<DidJwsJwt>(did);
  const jwt = parsed.id as CompactJws<"header.payload.signature">;
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
