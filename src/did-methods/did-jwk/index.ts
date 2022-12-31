import alg from "./alg";
import { toDid } from "./toDid";
import { generate, sign, verify, resolve, dereference } from "./actions";

const jwk = {
  alg,
  toDid,
  generate,
  sign,
  verify,

  resolve,
  dereference,
};

export default jwk;
