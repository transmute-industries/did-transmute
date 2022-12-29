import alg from "./alg";
import { toDid } from "./toDid";
import { generate, sign, verify, encrypt, decrypt } from "./actions";

const jwk = { alg, toDid, generate, sign, verify, encrypt, decrypt };

export default jwk;
