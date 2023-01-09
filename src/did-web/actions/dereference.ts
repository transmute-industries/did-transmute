import { dereferenceWithinDocument } from "../../did/dereferenceWithinDocument";
import { prefix } from "../method";
import { resolve } from "./resolve";
export const dereference: any = async ({ id, documentLoader }: any) => {
  if (!id.startsWith(prefix)) {
    throw new Error(`Method is not ${prefix}.`);
  }
  const didDocument = await resolve({ id, documentLoader });
  return dereferenceWithinDocument({ id, document: didDocument });
};
