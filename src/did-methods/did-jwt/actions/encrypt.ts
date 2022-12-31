import * as jose from "jose";
import { PublicKeyJwk } from "../../../types";

import { getKey } from "../../../util";
import { prefix } from "../method";
import { DidJwt, DidJwtActor } from "../types";
import { ClaimSet } from "../types/JsonWebToken";
import { ProtectedHeader } from "../../did-jwe/types/JsonWebEncryption";

export type Encrypt = {
  issuer: string;
  protectedHeader: ProtectedHeader;
  claimSet: ClaimSet;
  audience?: string | string[];
  publicKey: PublicKeyJwk;
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
