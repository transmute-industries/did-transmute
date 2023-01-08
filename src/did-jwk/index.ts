import { toDid } from "./toDid";
import {
  exportable,
  isolated,
  documentLoader,
  resolve,
  dereference,
} from "./actions";

const jwk = {
  toDid,
  exportable,
  isolated,

  documentLoader,

  resolve,
  dereference,
};

export default jwk;
