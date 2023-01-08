import did from "./did";

import {
  encryptToKey,
  decryptWithKey,
  signWithKey,
  verifyWithKey,
  alg,
} from "./jose";

const transmute = {
  did,
  jose: { alg },
  sign: signWithKey,
  verify: verifyWithKey,
  encrypt: encryptToKey,
  decrypt: decryptWithKey,
};

export * from "./types";

export default transmute;
