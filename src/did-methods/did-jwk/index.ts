import { toDid } from "./toDid";
import { exportable, isolated, resolve, dereference } from "./actions";

const jwk = {
  toDid,
  exportable,
  isolated,

  resolve,
  dereference,
};

export default jwk;
