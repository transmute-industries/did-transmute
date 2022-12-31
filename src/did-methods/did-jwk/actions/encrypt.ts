import { PublicKey } from "../../../types/PublicKey";
import { encryptToKey } from "../../did-jwe/actions/encryptToKey";

export type Encrypt = {
  plaintext: Uint8Array;
  publicKey: PublicKey;
};

export const encrypt = async ({ plaintext, publicKey }: Encrypt) => {
  return encryptToKey(plaintext, publicKey);
};
