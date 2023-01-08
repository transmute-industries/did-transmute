import * as jose from "jose";

import { getKey } from "../../jose/getKey";
import { PrivateKey } from "../../jose/PrivateKey";
import { ProtectedHeader } from "../../jose/ProtectedHeader";
import { ClaimSet } from "../../jose/ClaimSet";
import { prefix } from "../method";

import { DidJwsJwt, ExportableDidJwsJwtActor } from "../types";

export type Sign = {
  issuer: string;
  audience?: string | string[];
  protectedHeader: ProtectedHeader;
  claimSet: ClaimSet;
  privateKey: PrivateKey;
};

export const sign = async ({
  issuer,
  audience,
  protectedHeader,
  claimSet,
  privateKey,
}: Sign): Promise<ExportableDidJwsJwtActor> => {
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
  const did = `${prefix}:${jwt}` as DidJwsJwt;
  return { did };
};
