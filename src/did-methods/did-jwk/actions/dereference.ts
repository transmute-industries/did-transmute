import { DereferenceParameters } from "../../../types/DereferenceParameters";

import { dereference as didJwkDereference } from "../dereference";

export const dereference = async ({ didUrl }: DereferenceParameters) => {
  return didJwkDereference(didUrl);
};
