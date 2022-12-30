import * as jose from "jose";
import { getKey } from "../../../util";
import { prefix } from "../method";
import { DidJwt, DidJwtActor } from "../types";

export type Sign = {
  issuer: any;
  verifier: any; //  const audience = verifier.did;
  protectedHeader: any;
  claimSet: any;
  privateKey: any;
};

export const sign = async ({
  issuer,
  verifier,
  protectedHeader,
  claimSet,
  privateKey,
}: Sign): Promise<DidJwtActor> => {
  const key = await getKey(privateKey);
  const jwt = await new jose.SignJWT(claimSet)
    .setProtectedHeader(protectedHeader)
    .setIssuedAt()
    .setIssuer(issuer)
    .setAudience(verifier)
    .setExpirationTime("2h")
    .sign(key);
  const did = `${prefix}:${jwt}` as DidJwt;
  return { did };
};
