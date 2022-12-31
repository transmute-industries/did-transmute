import alg from "../did-jws/alg";

import {
  sign,
  verify,
  encrypt,
  decrypt,
  resolve,
  dereference,
} from "./actions";

const jws = { alg, sign, verify, encrypt, decrypt, resolve, dereference };

export default jws;
