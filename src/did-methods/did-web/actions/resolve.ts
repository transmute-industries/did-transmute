import { DidDocument } from "../../../types";
import { DidWebResolver } from "../../../types/DidWeb";

import { didToEndpoint } from "../didToEndpoint";

import { prefix } from "../method";

export const resolve: DidWebResolver = async ({
  did,
  documentLoader,
}): Promise<DidDocument | null> => {
  if (!did.startsWith(prefix)) {
    return null;
  }

  try {
    const url = didToEndpoint(did);
    const { document } = await documentLoader(url);
    return document;
  } catch (e) {
    return null;
  }
};
