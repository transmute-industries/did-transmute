import { prefix } from "../method";
import * as jose from "jose";

import { parseDidUrl } from "../../did/parseDidUrl";

import { resolveWithEmbeddedJwk } from "../resolveWithEmbeddedJwk";
import { resolveWithRelativeDidUrl } from "../resolveWithRelativeDidUrl";
import { resolveWithAccessToken } from "../resolveWithAccessToken";

import { DidJwtResolutionParameters, DidJwsJwtDocument } from "../types";

// documentLoader is a dynamic just in time allow-list.
export const resolve = async (
  params: DidJwtResolutionParameters
): Promise<DidJwsJwtDocument> => {
  const { id, profiles } = params;
  if (!id.startsWith(prefix)) {
    throw new Error(`Method is not ${prefix}.`);
  }
  const parsedDid = parseDidUrl(id);
  const protectedHeader = jose.decodeProtectedHeader(parsedDid.id);
  const { jwk, kid } = protectedHeader;

  if (jwk && profiles.includes("embedded-jwk")) {
    return resolveWithEmbeddedJwk(params);
  }

  if (kid && profiles.includes("relative-did-url")) {
    return resolveWithRelativeDidUrl(params);
  }

  if (kid && profiles.includes("access_token")) {
    return resolveWithAccessToken(params);
  }

  throw new Error(`Profile not supported.`);
};
