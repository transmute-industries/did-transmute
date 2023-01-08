import { didDocument } from "./didDocument";
import { resolve } from "./resolve";
import { getIssuerKeys } from "./getIssuerKeys";
import { getPublicKey } from "./getPublicKey";

const oidc = {
  resolve,
  getIssuerKeys,
  getPublicKey,
  didDocument,
};

export default oidc;
