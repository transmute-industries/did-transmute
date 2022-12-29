import { PrivateKeyJwk } from "../types/JsonWebKey";
import { decryptWithKey } from "../../did-jwe/actions/decryptWithKey";
import { CompactJsonWebEncryption } from "../../did-jwe/types/JsonWebEncryption";

export const decrypt = async (
  jwe: CompactJsonWebEncryption | string,
  privateKeyJwk: PrivateKeyJwk
) => {
  return decryptWithKey(jwe, privateKeyJwk);
};
