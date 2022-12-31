import { DidDocument, DereferenceParameters } from "../../../types";
import { VerificationMethod } from "../../../types/VerificationMethod";
import { Service } from "../../../types/Service";

import { dereferenceWithResolver } from "../../../util/dereferenceWithResolver";

export const dereference = async ({
  didUrl,
  resolver,
}: DereferenceParameters): Promise<
  DidDocument | VerificationMethod | Service | null
> => {
  return dereferenceWithResolver({ didUrl, resolver });
};
