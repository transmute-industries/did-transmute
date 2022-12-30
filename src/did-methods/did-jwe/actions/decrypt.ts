import { PrivateKeyJwk } from "../../../types";
import { DidJwe } from "../types/Did";
import { CompactJsonWebEncryption } from "../types/JsonWebEncryption";
import { decryptWithKey } from "./decryptWithKey";

export type Decrypt = {
  did: DidJwe;
  privateKey: PrivateKeyJwk;
};

export const decrypt = async ({ did, privateKey }: Decrypt) => {
  const jwe = did.split(":").pop() as CompactJsonWebEncryption;
  return decryptWithKey(jwe, privateKey);
};
