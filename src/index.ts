import cose from "@transmute/cose";

import did from "./did";

import w3c from "./w3c";
import scitt from "./scitt";

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
  cose,
  w3c,
  scitt,
  sign: signWithKey,
  verify: verifyWithKey,
  encrypt: encryptToKey,
  decrypt: decryptWithKey,
};

export * from "./types";

export default transmute;
