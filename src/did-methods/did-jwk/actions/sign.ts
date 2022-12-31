import { signWithKey } from "../../did-jws/actions/signWithKey";

import { PrivateKey } from "../../../types/PrivateKey";
import { CompactJsonWebSignature } from "../../../types/CompactJsonWebSignature";
import { ProtectedHeader } from "../../../types/ProtectedHeader";

export type Sign = {
  payload: Uint8Array;
  privateKey: PrivateKey;
  header: ProtectedHeader;
};

export const sign = async ({
  payload,
  privateKey,
  header,
}: Sign): Promise<CompactJsonWebSignature> => {
  return signWithKey(payload, privateKey, header);
};
