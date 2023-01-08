import * as jose from "jose";

import { getDidDocumentFromVerification } from "./getDidDocumentFromVerification";

export const resolveWithOpenIdConnectDiscovery: any = async ({
  did,
  resolver,
}: any) => {
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
