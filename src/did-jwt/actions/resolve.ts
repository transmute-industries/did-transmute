import { prefix } from "../method";
import * as jose from "jose";

import { parseDidUrl } from "../../did/parseDidUrl";

import { resolveWithEmbeddedJwk } from "../resolveWithEmbeddedJwk";
import { resolveWithRelativeDidUrl } from "../resolveWithRelativeDidUrl";
import { resolveWithAccessToken } from "../resolveWithAccessToken";
import { resolveWithPrivateKeyLoader } from "../resolveWithPrivateKeyLoader";

import {
  DidJwsJwtResolutionParameters,
  DidJweJwtResolutionParameters,
  DidJwtDocument,
} from "../types";

// documentLoader is a dynamic just in time allow-list.
// Needs generics now... cuz of private resolution
export const resolve = async (
  params: DidJwsJwtResolutionParameters | DidJweJwtResolutionParameters
): Promise<DidJwtDocument> => {
  const { id, profiles } = params;
  if (!id.startsWith(prefix)) {
    throw new Error(`Method is not ${prefix}.`);
  }
  const parsedDid = parseDidUrl(id);
  const protectedHeader = jose.decodeProtectedHeader(parsedDid.id);
  const { jwk, kid, enc } = protectedHeader;

  if (jwk && profiles.includes("embedded-jwk")) {
    return resolveWithEmbeddedJwk(params as DidJwsJwtResolutionParameters);
  }

  if (kid && profiles.includes("relative-did-url")) {
    return resolveWithRelativeDidUrl(params as DidJwsJwtResolutionParameters);
  }

  if (kid && profiles.includes("access_token")) {
    return resolveWithAccessToken(params as DidJwsJwtResolutionParameters);
  }

  if (enc && profiles.includes("encrypted-jwt")) {
    return resolveWithPrivateKeyLoader(params as DidJweJwtResolutionParameters);
  }

  throw new Error(`Profile not supported.`);
};
