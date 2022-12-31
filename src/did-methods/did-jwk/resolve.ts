import * as jose from "jose";
import { toDidDocument } from "./toDidDocument";

import { DidUrl } from "./types/DidDocument";
import { parseDidUrl } from "../../util/parseDidUrl";

export const resolve = (didUrl: DidUrl | string) => {
  const { did } = parseDidUrl(didUrl);
  const methodSpecificIdentifier = did.split(":").pop() || "";
  const decoded = jose.base64url.decode(methodSpecificIdentifier);
  const jwk = JSON.parse(new TextDecoder().decode(decoded));
  return toDidDocument(jwk);
};
