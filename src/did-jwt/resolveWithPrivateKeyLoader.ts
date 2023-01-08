import * as jose from "jose";
import { parseDidUrl } from "../did/parseDidUrl";
import { getDidDocumentFromDecryption } from "./getDidDocumentFromDecryption";

import { DidJweJwt, DidJweJwtResolutionParameters } from "./types";

export const resolveWithPrivateKeyLoader = async ({
  id,
  privateKeyLoader,
}: DidJweJwtResolutionParameters) => {
  const parsed = parseDidUrl<DidJweJwt>(id);
  const jwe = parsed.id;
  const { iss, kid } = jose.decodeProtectedHeader(jwe);
  if (!iss) {
    throw new Error(
      "protectedHeader.iss is required by privateKeyLoader, but not present."
    );
  }
  if (!kid) {
    throw new Error(
      "protectedHeader.kid is required by privateKeyLoader, but not present."
    );
  }
  const absolutePrivateKeyDidUrl = `${iss}${kid}`;
  const privateKey = await privateKeyLoader(absolutePrivateKeyDidUrl);
  return getDidDocumentFromDecryption({
    did: id,
    issuer: iss as string,
    privateKey,
  });
};
