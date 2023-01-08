import { prefix } from "../method";
import { resolve } from "./resolve";

import { dereferenceWithinDocument } from "../../did/dereferenceWithinDocument";

export const dereference: any = async ({
  id,
  documentLoader,
  profiles,
}: any) => {
  if (!id.startsWith(prefix)) {
    throw new Error(`Method is not ${prefix}.`);
  }
  const didDocument = await resolve({ id, documentLoader, profiles });
  const item = dereferenceWithinDocument({
    id,
    document: didDocument,
  });

  if (item) {
    return item;
  }
  throw new Error(`Profile not supported.`);
};
