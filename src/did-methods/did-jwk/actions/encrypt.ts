import { PublicKeyJwk } from "../types/JsonWebKey";
import { encryptToKey } from "../../did-jwe/actions/encryptToKey";

export const encrypt = async (
  plaintext: Uint8Array,
  publicKeyJwk: PublicKeyJwk
) => {
  return encryptToKey(plaintext, publicKeyJwk);
};
