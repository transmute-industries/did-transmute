import alg from "../did-jws/alg";

import { sign, verify, encrypt, decrypt, resolve } from "./actions";

const jws = { alg, sign, verify, encrypt, decrypt, resolve };

export default jws;
