import * as jose from "jose";

import { parseDidUrl } from "../../../util/parseDidUrl";

import { DidJwt, DidJwtResolver } from "../../../types/DidJwt";
import { prefix } from "../method";

import { resolveWithEmbeddedJwk } from "../resolveWithEmbeddedJwk";
import { resolveWithIss } from "../resolveWithIss";
import { resolveWithOpenIdConnectDiscovery } from "../resolveWithOpenIdConnectDiscovery";
export const resolve: DidJwtResolver = async ({ did, resolver }) => {
  if (!did.startsWith(prefix)) {
    return null;
  }
  const parsedDid = parseDidUrl(did);
  const didJwt = parsedDid.did as DidJwt;
  const jws = parsedDid.did.split(":").pop() as string;
  const protectedHeader = jose.decodeProtectedHeader(jws);
  const { jwk, iss, kid } = protectedHeader;

  if (jwk) {
    return resolveWithEmbeddedJwk({ did: didJwt, resolver });
  }
  if (!iss && kid) {
    return resolveWithOpenIdConnectDiscovery({
      did: didJwt,
      resolver,
    });
  }
  if (iss && kid) {
    return resolveWithIss({ did: didJwt, resolver });
  }

  return null;
};
