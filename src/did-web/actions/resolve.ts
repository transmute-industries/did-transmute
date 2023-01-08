import { didToEndpoint } from "../didToEndpoint";

import { prefix } from "../method";

export const resolve: any = async ({
  id,
  documentLoader,
}: any): Promise<any | null> => {
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
