import alg from "./alg";
import { toDid } from "./toDid";
import { generate, resolve, dereference } from "./actions";

const jwk = {
  alg,
  toDid,
  generate,

  resolve,
  dereference,
};

export default jwk;
