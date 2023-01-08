import { prefix } from "../method";
import { resolve } from "./resolve";

import { dereferenceWithinDocument } from "../../did/dereferenceWithinDocument";
import {
  DidJwsJwtResolutionParameters,
  DidJweJwtResolutionParameters,
} from "../types";

export const dereference = async <U>(
  params: DidJwsJwtResolutionParameters | DidJweJwtResolutionParameters
) => {
  const { id } = params;
  if (!id.startsWith(prefix)) {
    throw new Error(`Method is not ${prefix}.`);
  }
  const didDocument = await resolve(params);
  const item = dereferenceWithinDocument<U>({
    id,
    document: didDocument,
  });
  if (item) {
    return item;
  }
  throw new Error(`Profile not supported.`);
};
