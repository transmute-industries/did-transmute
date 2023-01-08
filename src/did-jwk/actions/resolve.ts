import { DidJwkDocument, DidJwkResolutionParameters } from "../types";

import { prefix } from "../method";

export const resolve = async ({
  id,
  documentLoader,
}: DidJwkResolutionParameters) => {
  if (!id.startsWith(prefix)) {
    throw new Error("Method is not did:jwk.");
  }
  const { document } = await documentLoader(id);
  return document as DidJwkDocument;
};
