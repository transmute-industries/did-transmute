import * as jose from "jose";

import { getKey } from "../../../util";
import { prefix } from "../method";
import { DidJwt, DidJwtActor } from "../types";

export type Encrypt = {
  issuer: any;
  verifier: any; //  const audience = verifier.did;
  protectedHeader: any;
  claimSet: any;
  publicKey: any;
};

export const encrypt = async ({
  issuer,
  verifier,
  protectedHeader,
  claimSet,
  publicKey, // remove...
}: Encrypt): Promise<DidJwtActor> => {
  const key = await getKey(publicKey);

  const jwt = await new jose.EncryptJWT(claimSet)
    .setProtectedHeader(protectedHeader)
    .setIssuedAt()
    .setIssuer(issuer)
    .setAudience(verifier)
    .setExpirationTime("2h")
    .encrypt(key);

  const did = `${prefix}:${jwt}` as DidJwt;
  return { did };
};
