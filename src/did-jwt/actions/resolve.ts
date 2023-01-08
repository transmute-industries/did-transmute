import { prefix } from "../method";
import * as jose from "jose";

import { parseDidUrl } from "../../did/parseDidUrl";

import { DidJwsJwt } from "../types";

import { resolveWithEmbeddedJwk } from "../resolveWithEmbeddedJwk";
import { resolveWithRelativeDidUrl } from "../resolveWithRelativeDidUrl";

// documentLoader is a dynamic just in time allow-list.
export const resolve: any = async ({ id, documentLoader, profiles }: any) => {
  if (!id.startsWith(prefix)) {
    throw new Error(`Method is not ${prefix}.`);
  }
  const parsedDid = parseDidUrl<DidJwsJwt>(id);
  const protectedHeader = jose.decodeProtectedHeader(parsedDid.id);
  const { jwk, kid } = protectedHeader;

  if (jwk && profiles.includes("embedded-jwk")) {
    return resolveWithEmbeddedJwk({ id, documentLoader });
  }

  if (kid && profiles.includes("relative-did-url")) {
    return resolveWithRelativeDidUrl({ id, documentLoader });
  }

  // import { resolveWithEmbeddedJwk } from "../resolveWithEmbeddedJwk";
  // import { resolveWithIss } from "../resolveWithIss";
  // import { resolveWithOpenIdConnectDiscovery } from "../resolveWithOpenIdConnectDiscovery";

  // if (!iss && kid) {
  //   return resolveWithOpenIdConnectDiscovery({
  //     did: didJwt,
  //     resolver,
  //   });
  // }
  // if (iss && kid) {
  //   return resolveWithIss({ did: didJwt, resolver });
  // }

  // return null;

  throw new Error(`Profile not supported.`);
};
