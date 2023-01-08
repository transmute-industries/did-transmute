import {
  KeyOperation,
  Recommended,
  Sign,
  Verify,
  Encrypt,
  Decrypt,
  DeriveKey,
} from "../types/KeyOperation";

import { jwsAlg, jweAlg } from "../jose/alg";

export const sign: Sign = "sign";
export const verify: Verify = "verify";
export const encrypt: Encrypt = "encrypt";
export const decrypt: Decrypt = "decrypt";
export const deriveKey: DeriveKey = "deriveKey";

// https://www.rfc-editor.org/rfc/rfc7517.html#section-4.3
export const keyOperations: Record<KeyOperation, string> = {
  sign: "compute digital signature or MAC",
  verify: "verify digital signature or MAC",
  encrypt: "encrypt content",
  decrypt: "decrypt content and validate decryption, if applicable",
  deriveKey: "derive key",
};

export const algForKeyOperation: Recommended = {
  sign: jwsAlg.EdDSA,
  verify: jwsAlg.EdDSA,
  encrypt: jweAlg.ECDH_ES_A256KW,
  decrypt: jweAlg.ECDH_ES_A256KW,
  deriveKey: jweAlg.ECDH_ES_A256KW,
};
