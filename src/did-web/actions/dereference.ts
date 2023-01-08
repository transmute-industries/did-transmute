import { prefix } from "../method";

export const dereference: any = async ({ id, documentLoader }: any) => {
  if (!id.startsWith(prefix)) {
    throw new Error(`Method is not ${prefix}.`);
  }
  // this resolver needs to handle both did:jwk and did:jwt...
  // return dereferenceWithResolver({ didUrl, resolver: resolver as Resolver }); // needs generics
  throw new Error("refactor stub");
};
