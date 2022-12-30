import * as jose from "jose";
import { PrivateKeyJwk } from "../../../types";
import { getKey } from "../../../util";
import { prefix } from "../method";
import { DidJwt, DidJwtActor } from "../types";
import { ClaimSet, ProtectedHeader } from "../types/JsonWebToken";

export type Sign = {
  issuer: string;
  audience?: string | string[];

  protectedHeader: ProtectedHeader;
  claimSet: ClaimSet;
  privateKey: PrivateKeyJwk;
};

export const sign = async ({
  issuer,
  audience,
  protectedHeader,
  claimSet,
  privateKey,
}: Sign): Promise<DidJwtActor> => {
  const issuerKey = await getKey(privateKey);
  const content = new jose.SignJWT(claimSet)
    .setProtectedHeader(protectedHeader)
    .setIssuedAt()
    .setIssuer(issuer)
    .setExpirationTime("2h");
  if (audience) {
    content.setAudience(audience);
  }
  const jwt = await content.sign(issuerKey);
  const did = `${prefix}:${jwt}` as DidJwt;
  return { did };
};
