import { DidJwkDereference } from "../../types/DidJwk";
// import { Resolver } from "../../../types/Resolver";
import { dereferenceWithResolver } from "../../util/dereferenceWithResolver";
import { prefix } from "../method";

export const dereference: DidJwkDereference = async ({ didUrl, resolver }) => {
  if (!didUrl.startsWith(prefix)) {
    return null;
  }
  return dereferenceWithResolver({
    didUrl,
    resolver: resolver as any, // needs generics...
  });
};
