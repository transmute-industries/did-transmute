import { dereferenceWithinDocument } from "../../did/dereferenceWithinDocument";

import { prefix } from "../method";
import { DidJwkResolutionParameters, DidJwkVerificationMethod } from "../types";

export const dereference = async ({
  id,
  documentLoader,
}: DidJwkResolutionParameters) => {
  if (!id.startsWith(prefix)) {
    throw new Error("Method is not did:jwk.");
  }
  const { document } = await documentLoader(id);
  const resource = dereferenceWithinDocument({
    id,
    document,
  });
  return resource as DidJwkVerificationMethod;
};
