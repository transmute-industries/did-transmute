import alg from "../did-jws/alg";

import { sign, verify, encrypt, decrypt } from "./actions";

const jws = { alg, sign, verify, encrypt, decrypt };

export default jws;
