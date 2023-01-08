import { PublicKeyJwk } from "../types";
import { getIssuerKeys } from "./getIssuerKeys";
export const getPublicKey = async ({
  iss,
  kid,
}: {
  iss: string;
  kid: string;
}) => {
  try {
    const keys = await getIssuerKeys({ iss });
    const publicKeyJwk = keys.find((jwk: PublicKeyJwk) => {
      return jwk.kid === kid;
    });
    return publicKeyJwk;
  } catch (e) {
    return null;
  }
};
