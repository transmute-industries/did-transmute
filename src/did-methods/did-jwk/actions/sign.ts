import { signWithKey } from "../../did-jws/actions/signWithKey";
import {
  CompactJsonWebSignature,
  ProtectedHeader,
} from "../../did-jws/types/JsonWebSignature";
import { PrivateKeyJwk } from "../types/JsonWebKey";

export const sign = async (
  payload: Uint8Array,
  privateKey: CryptoKey | PrivateKeyJwk,
  header: ProtectedHeader
): Promise<CompactJsonWebSignature> => {
  return signWithKey(payload, privateKey, header);
};
