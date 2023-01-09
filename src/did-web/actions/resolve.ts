import { didToEndpoint } from "../didToEndpoint";

import { prefix } from "../method";
import { DidWebResolver, DidWebResolveParams } from "../types";

export const resolve: DidWebResolver = async ({
  id,
  documentLoader,
}: DidWebResolveParams) => {
  if (!id.startsWith(prefix)) {
    return null;
  }
  try {
    const url = didToEndpoint(id);
    const { document } = await documentLoader(url);
    return document;
  } catch (e) {
    return null;
  }
};
