import jwk from "./did-jwk";
import jwe from "./did-jwe";
import jws from "./did-jws";
import jwt from "./did-jwt";

import { parseDidUrl } from "../util/parseDidUrl";

const did = { jwk, jwe, jws, jwt, parse: parseDidUrl };

export default did;
