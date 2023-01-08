import { getOpenIdConnectIssuerPublicKey } from "../../util/getOpenIdConnectIssuerPublicKey";

import alg from "../did-jws/alg";

import {
  sign,
  verify,
  encrypt,
  decrypt,
  resolve,
  dereference,
} from "./actions";

const jwt = {
  alg,
  sign,
  verify,
  encrypt,
  decrypt,
  resolve,
  dereference,
  getOpenIdConnectIssuerPublicKey,
};

export default jwt;
