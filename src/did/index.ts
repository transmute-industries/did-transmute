import { parseDidUrl } from "./parseDidUrl";

import jwk from "../did-jwk";
import oidc from "../did-oidc";
import jwt from "../did-jwt";
import web from "../did-web";

const did = {
  jwk,
  oidc,
  jwt,
  web,
  parse: parseDidUrl,
};

export default did;
