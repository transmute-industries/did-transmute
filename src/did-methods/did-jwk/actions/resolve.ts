import { prefix } from "../method";
import { Did } from "../../../types/Did";
import { DidDocument } from "../../../types";

import { resolve as didJwkResolve } from "../resolve";

export type Resolve = {
  did: Did;
};

export const resolve = async ({
  did,
}: Resolve): Promise<DidDocument | null> => {
  return did.startsWith(prefix) ? didJwkResolve(did) : null;
};
