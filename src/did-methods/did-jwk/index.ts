import alg from "./alg";
import { toDid } from "./toDid";
import {
  generate,
  sign,
  verify,
  encrypt,
  decrypt,
  resolve,
  dereference,
} from "./actions";

const jwk = {
  alg,
  toDid,
  generate,
  sign,
  verify,
  encrypt,
  decrypt,
  resolve,
  dereference,
};

export default jwk;
