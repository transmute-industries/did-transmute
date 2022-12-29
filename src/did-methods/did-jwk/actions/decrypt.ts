import { PrivateKeyJwk } from "../types/JsonWebKey";
import { decryptWithKey } from "../../did-jwe/actions/decryptWithKey";
import { CompactJsonWebEncryption } from "../../did-jwe/types/JsonWebEncryption";

export type Decrypt = {
  jwe: CompactJsonWebEncryption | string;
  privateKey: CryptoKey | PrivateKeyJwk;
};
export const decrypt = async ({ jwe, privateKey }: Decrypt) => {
  return decryptWithKey(jwe, privateKey);
};
