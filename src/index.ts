import did from "./did-methods";

import {
  encryptToKey,
  decryptWithKey,
  signWithKey,
  verifyWithKey,
} from "./jose";

const transmute = {
  did,
  sign: signWithKey,
  verify: verifyWithKey,
  encrypt: encryptToKey,
  decrypt: decryptWithKey,
};

export * from "./types";

export default transmute;
