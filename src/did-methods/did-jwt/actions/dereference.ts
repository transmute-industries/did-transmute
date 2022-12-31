import { DidDocument, DereferenceParameters } from "../../../types";
import { VerificationMethod } from "../../../types/VerificationMethod";
import { Service } from "../../../types/Service";

import { dereferenceWithResolver } from "../../../util/dereferenceWithResolver";
import { prefix } from "../method";

export const dereference = async ({
  didUrl,
  resolver,
}: DereferenceParameters): Promise<
  DidDocument | VerificationMethod | Service | null
> => {
  if (!didUrl.startsWith(prefix)) {
    return null;
  }
  return dereferenceWithResolver({ didUrl, resolver });
};
