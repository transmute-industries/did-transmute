import * as jose from "jose";
import { PublicKeyJwk } from "../../did-jwk/types/JsonWebKey";

export const encryptToKey = async (
  plaintext: Uint8Array,
  publicKeyJwk: PublicKeyJwk
) => {
  const publicKey = await jose.importJWK(publicKeyJwk);
  const jwe = await new jose.CompactEncrypt(plaintext)
    .setProtectedHeader({ alg: publicKeyJwk.alg, enc: "A256GCM" })
    .encrypt(publicKey);
  return jwe;
};
