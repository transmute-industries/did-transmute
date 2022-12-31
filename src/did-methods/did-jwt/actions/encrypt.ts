import * as jose from "jose";

import { getKey } from "../../../util";
import { prefix } from "../method";

import { DidJwt, DidJwtActor } from "../../../types/DidJwt";
import { ClaimSet } from "../../../types/ClaimSet";

import { PublicKey } from "../../../types/PublicKey";

export type Encrypt = {
  issuer: string;
  protectedHeader: jose.CompactJWEHeaderParameters;
  claimSet: ClaimSet;
  audience?: string | string[];
  publicKey: PublicKey;
};

export const encrypt = async ({
  issuer,
  audience,
  protectedHeader,
  claimSet,
  publicKey,
}: Encrypt): Promise<DidJwtActor> => {
  const key = await getKey(publicKey);
  const content = new jose.EncryptJWT(claimSet)
    .setProtectedHeader(protectedHeader)
    .setIssuedAt()
    .setIssuer(issuer)
    .setExpirationTime("2h");

  if (audience) {
    content.setAudience(audience);
  }

  const jwt = await content.encrypt(key);
  const did = `${prefix}:${jwt}` as DidJwt;
  return { did };
};
