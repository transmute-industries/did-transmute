import { DereferenceParameters } from "../../../types/DereferenceParameters";

import { dereferenceWithResolver } from "../../../util/dereferenceWithResolver";

export const dereference = async ({
  didUrl,
  resolver,
}: DereferenceParameters) => {
  return dereferenceWithResolver({ didUrl, resolver });
};
