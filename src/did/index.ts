import { parseDidUrl } from "./parseDidUrl";

import jwk from "../did-jwk";
import jwt from "../did-jwt";
// import web from "./did-web";

const did = {
  jwk,
  jwt,
  // web,
  parse: parseDidUrl,
};

export default did;
