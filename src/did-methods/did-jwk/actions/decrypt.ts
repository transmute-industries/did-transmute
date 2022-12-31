import { decryptWithKey } from "../../did-jwe/actions/decryptWithKey";

import { PrivateKey } from "../../../types/PrivateKey";
import { CompactJsonWebEncryption } from "../../../types/CompactJsonWebEncryption";

export type Decrypt = {
  jwe: CompactJsonWebEncryption | string;
  privateKey: PrivateKey;
};
export const decrypt = async ({ jwe, privateKey }: Decrypt) => {
  return decryptWithKey(jwe, privateKey);
};
