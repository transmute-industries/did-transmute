import * as jose from "jose";

import { PublicKey } from "../../../types/PublicKey";
import { PublicKeyJwk } from "../../../types/PublicKeyJwk";
import { getKey } from "../../../util";

export const encryptToKey = async (
  plaintext: Uint8Array,
  publicKey: PublicKey
) => {
  const key = await getKey(publicKey);
  const jwe = await new jose.CompactEncrypt(plaintext)
    .setProtectedHeader({
      alg: (publicKey as PublicKeyJwk).alg,
      enc: "A256GCM", // fixme
    } as any)
    .encrypt(key);
  return jwe;
};
