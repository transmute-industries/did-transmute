import axios from "axios";

export const getIssuerKeys = async ({ iss }: { iss: string }) => {
  try {
    const openIdConnectDicoveryDocument =
      iss + ".well-known/openid-configuration";
    const {
      data: { jwks_uri },
    } = await axios.get(openIdConnectDicoveryDocument);
    const {
      data: { keys },
    } = await axios.get(jwks_uri);
    return keys;
  } catch (e) {
    return [];
  }
};
