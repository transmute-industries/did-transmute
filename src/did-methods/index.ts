import jwk from "./did-jwk";
import jws from "./did-jws";
import jwe from "./did-jwe";

import { parseDidUrl } from "./did-jwk/parseDidUrl";

const did = { jwk, jws, jwe, parse: parseDidUrl };

export default did;
