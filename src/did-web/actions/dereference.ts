import { dereferenceWithinDocument } from "../../did/dereferenceWithinDocument";
import { prefix } from "../method";
import { resolve } from "./resolve";

import { DidWebDereferencer, DidWebDereferenceParams } from "../types";

export const dereference: DidWebDereferencer = async ({
  id,
  documentLoader,
}: DidWebDereferenceParams) => {
  if (!id.startsWith(prefix)) {
    throw new Error(`Method is not ${prefix}.`);
  }
  const didDocument = await resolve({ id, documentLoader });
  return dereferenceWithinDocument({ id, document: didDocument });
};
