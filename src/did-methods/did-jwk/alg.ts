import * as Algorithm from "../../types/Algorithm";

import { signatureAlgorithms } from "../did-jws/alg";
import { keyAgreementAlgorithms } from "../did-jwe/alg";

import jwsAlg from "../did-jws/alg";
import jweAlg from "../did-jwe/alg";

export const algorithms: Algorithm.Algorithm[] = [
  ...signatureAlgorithms,
  ...keyAgreementAlgorithms,
];

export const alg = {
  ...jwsAlg,
  ...jweAlg,
};

export default alg;
