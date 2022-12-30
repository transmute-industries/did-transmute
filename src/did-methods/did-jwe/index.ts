import alg from "./alg";
import enc from "./enc";

import { encrypt, decrypt } from "./actions";

const jwe = { alg, enc, encrypt, decrypt };

export default jwe;
