import * as jose from "jose";
import { toDidDocument } from "./toDidDocument";

import { DidUrl } from "./types/DidDocument";
import { parseDidUrl } from "./parseDidUrl";

export const resolve = (didUrl: DidUrl) => {
  const { did } = parseDidUrl(didUrl);
  const methodSpecificIdentifier = did.split(":").pop() || "";
  const decoded = jose.base64url.decode(methodSpecificIdentifier);
  const jwk = JSON.parse(decoded.toString());
  return toDidDocument(jwk);
};
