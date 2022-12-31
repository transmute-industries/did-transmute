import { decryptWithKey } from "./decryptWithKey";

import { DidJwe } from "../../../types/DidJwe";
import { CompactJsonWebEncryption } from "../../../types/CompactJsonWebEncryption";
import { PrivateKey } from "../../../types/PrivateKey";

export type Decrypt = {
  did: DidJwe;
  privateKey: PrivateKey;
};

export const decrypt = async ({ did, privateKey }: Decrypt) => {
  const jwe = did.split(":").pop() as CompactJsonWebEncryption;
  return decryptWithKey(jwe, privateKey);
};
