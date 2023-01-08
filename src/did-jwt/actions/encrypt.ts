import * as jose from "jose";

import { getKey } from "../../jose/getKey";
import { PublicKey } from "../../jose/PublicKey";
import { ClaimSet } from "../../jose/ClaimSet";

import { prefix } from "../method";

import { DidJweJwt, ExportableDidJweJwtActor } from "../types";

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
}: Encrypt): Promise<ExportableDidJweJwtActor> => {
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
  const did = `${prefix}:${jwt}` as DidJweJwt;
  return { did };
};
