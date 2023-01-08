import { didDocument } from "./didDocument";
import { getIssuerKeys } from "./getIssuerKeys";

export const resolve = async ({ iss }: { iss: string }) => {
  const jwks = await getIssuerKeys({ iss });
  return didDocument({ iss, jwks });
};
