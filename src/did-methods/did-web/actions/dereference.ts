import { Resolver } from "../../../types";
import { DidWebDereference } from "../../../types/DidWeb";

import { dereferenceWithResolver } from "../../../util/dereferenceWithResolver";

import { prefix } from "../method";

export const dereference: DidWebDereference = async ({ didUrl, resolver }) => {
  if (!didUrl.startsWith(prefix)) {
    return null;
  }
  // this resolver needs to handle both did:jwk and did:jwt...
  return dereferenceWithResolver({ didUrl, resolver: resolver as Resolver }); // needs generics
};
