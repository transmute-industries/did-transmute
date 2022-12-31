import { DereferenceParameters } from "../../../types/DereferenceParameters";

import { dereferenceWithResolver } from "../../../util/dereferenceWithResolver";
import { prefix } from "../method";

export const dereference = async ({
  didUrl,
  resolver,
}: DereferenceParameters) => {
  if (!didUrl.startsWith(prefix)) {
    return null;
  }
  return dereferenceWithResolver({ didUrl, resolver });
};
