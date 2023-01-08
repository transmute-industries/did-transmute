import { DidJwkDocument, DidJwkResolver } from "../types";

import { prefix } from "../method";

export const resolve: DidJwkResolver = async ({ id, documentLoader }) => {
  if (!id.startsWith(prefix)) {
    throw new Error(`Method is not ${prefix}.`);
  }
  const { document } = await documentLoader(id);
  return document as DidJwkDocument;
};
