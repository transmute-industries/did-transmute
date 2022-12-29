import {
  KeyOperation,
  Recommended,
  Sign,
  Verify,
  Encrypt,
  Decrypt,
  WrapKey,
  UnwrapKey,
  DeriveKey,
  DeriveBits,
} from "./types/KeyOperation";

import jwsAlg from "../did-jws/alg";
import jweAlg, { ECDH_ES_A256KW } from "../did-jwe/alg";

export const sign: Sign = "sign";
export const verify: Verify = "verify";
export const encrypt: Encrypt = "encrypt";
export const decrypt: Decrypt = "decrypt";
export const wrapKey: WrapKey = "wrapKey";
export const unwrapKey: UnwrapKey = "unwrapKey";
export const deriveKey: DeriveKey = "deriveKey";
export const deriveBits: DeriveBits = "deriveBits";

// https://www.rfc-editor.org/rfc/rfc7517.html#section-4.3
export const keyOperations: Record<KeyOperation, string> = {
  sign: "compute digital signature or MAC",
  verify: "verify digital signature or MAC",
  encrypt: "encrypt content",
  decrypt: "decrypt content and validate decryption, if applicable",
  wrapKey: "encrypt key",
  unwrapKey: "decrypt key and validate decryption, if applicable",
  deriveKey: "derive key",
  deriveBits: "derive bits not to be used as a key",
};

export const algForKeyOperation: Recommended = {
  sign: jwsAlg.EdDSA,
  verify: jwsAlg.EdDSA,
  //
  encrypt: jweAlg[ECDH_ES_A256KW],
  decrypt: jweAlg[ECDH_ES_A256KW],
  //
  wrapKey: jweAlg[ECDH_ES_A256KW],
  unwrapKey: jweAlg[ECDH_ES_A256KW],
  //
  deriveKey: jweAlg[ECDH_ES_A256KW],
  deriveBits: jweAlg[ECDH_ES_A256KW],
};
