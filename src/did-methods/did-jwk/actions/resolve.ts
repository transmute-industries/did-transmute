import * as jose from "jose";
import { prefix } from "../method";
import { DidJwkResolver } from "../../../types/DidJwk";

import { parseDidUrl } from "../../../util/parseDidUrl";
import { toDidDocument } from "../toDidDocument";

export const resolve: DidJwkResolver = async ({ did }) => {
  if (!did.startsWith(prefix)) {
    return null;
  }
  const parsed = parseDidUrl(did);
  const methodSpecificIdentifier = parsed.did.split(":").pop() || "";
  const decoded = jose.base64url.decode(methodSpecificIdentifier);
  const jwk = JSON.parse(new TextDecoder().decode(decoded));
  return toDidDocument(jwk);
};
