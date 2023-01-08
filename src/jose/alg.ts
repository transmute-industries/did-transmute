import * as KeyAgreementAlgorithm from "../types/KeyAgreementAlgorithm";

import * as SignatureAlgorithm from "../types/SignatureAlgorithm";

export const EdDSA: SignatureAlgorithm.EdDSA = "EdDSA";
export const ES256K: SignatureAlgorithm.ES256K = "ES256K";
export const ES256: SignatureAlgorithm.ES256 = "ES256";
export const ES384: SignatureAlgorithm.ES384 = "ES384";
export const ES512: SignatureAlgorithm.ES512 = "ES512";

export const jwsAlg = {
  EdDSA,
  ES256K,
  ES256,
  ES384,
  ES512,
};

export const signatureAlgorithms: SignatureAlgorithm.SignatureAlgorithm[] = [
  ES256,
  ES384,
  ES512,
  EdDSA,
  ES256K,
];

export const ECDH_ES_A256KW: KeyAgreementAlgorithm.ECDH_ES_A256KW =
  "ECDH-ES+A256KW";
export const RSA_OAEP_256: KeyAgreementAlgorithm.RSA_OAEP_256 = "RSA-OAEP-256";

export const keyAgreementAlgorithms: KeyAgreementAlgorithm.KeyAgreementAlgorithm[] =
  [ECDH_ES_A256KW, RSA_OAEP_256];

export const jweAlg = {
  ECDH_ES_A256KW: ECDH_ES_A256KW,
  RSA_OAEP_256: RSA_OAEP_256,
};

export const alg = {
  ...jwsAlg,
  ...jweAlg,
};

export const algorithms: Array<
  | KeyAgreementAlgorithm.KeyAgreementAlgorithm
  | SignatureAlgorithm.SignatureAlgorithm
> = [...signatureAlgorithms, ...keyAgreementAlgorithms];

export default alg;
