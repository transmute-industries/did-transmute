import axios from "axios";
import { PublicKeyJwk } from "../types";

export const getOpenIdConnectIssuerPublicKey = async ({
  iss,
  kid,
}: {
  iss: string;
  kid: string;
}) => {
  try {
    const openIdConnectDicoveryDocument =
      iss + ".well-known/openid-configuration";
    const {
      data: { jwks_uri },
    } = await axios.get(openIdConnectDicoveryDocument);
    const {
      data: { keys },
    } = await axios.get(jwks_uri);
    const publicKeyJwk = keys.find((jwk: PublicKeyJwk) => {
      return jwk.kid === kid;
    });
    return publicKeyJwk;
  } catch (e) {
    return null;
  }
};
