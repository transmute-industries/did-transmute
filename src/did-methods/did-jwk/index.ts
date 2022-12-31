import alg from "./alg";
import { toDid } from "./toDid";
import { exportable, isolated, resolve, dereference } from "./actions";

const jwk = {
  alg,
  toDid,
  exportable,
  isolated,

  resolve,
  dereference,
};

export default jwk;
