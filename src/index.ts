import did from "./did";

import {
  encryptToKey,
  decryptWithKey,
  signWithKey,
  verifyWithKey,
  alg,
  enc,
} from "./jose";

const transmute = {
  did,
  jose: { alg, enc },
  sign: signWithKey,
  verify: verifyWithKey,
  encrypt: encryptToKey,
  decrypt: decryptWithKey,
};

export * from "./types";

export default transmute;
