import * as Algorithm from "./types/Algorithm";

export const ECDH_ES_A256KW: Algorithm.ECDH_ES_A256KW = "ECDH-ES+A256KW";
export const RSA_OAEP_256: Algorithm.RSA_OAEP_256 = "RSA-OAEP-256";

export const keyAgreementAlgorithms: Algorithm.KeyAgreementAlgorithm[] = [
  ECDH_ES_A256KW,
  RSA_OAEP_256,
];

const alg = {
  [ECDH_ES_A256KW]: ECDH_ES_A256KW,
  [RSA_OAEP_256]: RSA_OAEP_256,
};

export default alg;
