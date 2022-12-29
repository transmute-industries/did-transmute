import { signWithKey } from "../../did-jws/actions/signWithKey";
import {
  CompactJsonWebSignature,
  ProtectedHeader,
} from "../../did-jws/types/JsonWebSignature";
import { PrivateKeyJwk } from "../types/JsonWebKey";

export type Sign = {
  payload: Uint8Array;
  privateKey: CryptoKey | PrivateKeyJwk;
  header: ProtectedHeader;
};

export const sign = async ({
  payload,
  privateKey,
  header,
}: Sign): Promise<CompactJsonWebSignature> => {
  return signWithKey(payload, privateKey, header);
};
