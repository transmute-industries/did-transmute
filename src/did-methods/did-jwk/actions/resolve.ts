import * as jose from "jose";
import { prefix } from "../method";
import { DidJwk } from "../../../types/DidJwk";
import { DidDocument } from "../../../types";

import { parseDidUrl } from "../../../util/parseDidUrl";
import { toDidDocument } from "../toDidDocument";

export type Resolve = {
  did: DidJwk;
};

export const resolve = async ({
  did,
}: Resolve): Promise<DidDocument | null> => {
  if (!did.startsWith(prefix)) {
    return null;
  }
  const parsed = parseDidUrl(did);
  const methodSpecificIdentifier = parsed.did.split(":").pop() || "";
  const decoded = jose.base64url.decode(methodSpecificIdentifier);
  const jwk = JSON.parse(new TextDecoder().decode(decoded));
  return toDidDocument(jwk);
};
