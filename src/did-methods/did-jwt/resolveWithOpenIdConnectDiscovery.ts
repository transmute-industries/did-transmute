import * as jose from "jose";
import { DidJwtResolver } from "../../types";
import { getDidDocumentFromVerification } from "./getDidDocumentFromVerification";

export const resolveWithOpenIdConnectDiscovery: DidJwtResolver = async ({
  did,
  resolver,
}) => {
  const jws = did.split(":").pop() as string;
  const { kid } = jose.decodeProtectedHeader(jws) as any;
  const { iss } = jose.decodeJwt(jws) as any;
  const publicKeyJwk = (await resolver({ iss, kid } as any)) as any;
  return getDidDocumentFromVerification({
    did,
    issuer: iss,
    publicKey: publicKeyJwk,
  });
};
