import { PublicKeyJwk } from "../types/JsonWebKey";
import { encryptToKey } from "../../did-jwe/actions/encryptToKey";

export type Encrypt = {
  plaintext: Uint8Array;
  publicKey: PublicKeyJwk;
};

export const encrypt = async ({ plaintext, publicKey }: Encrypt) => {
  return encryptToKey(plaintext, publicKey);
};
