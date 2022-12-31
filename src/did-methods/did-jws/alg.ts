import * as Algorithm from "../../types/SignatureAlgorithm";

export const EdDSA: Algorithm.EdDSA = "EdDSA";
export const ES256K: Algorithm.ES256K = "ES256K";
export const ES256: Algorithm.ES256 = "ES256";
export const ES384: Algorithm.ES384 = "ES384";
export const ES512: Algorithm.ES512 = "ES512";

export const alg = {
  EdDSA,
  ES256K,
  ES256,
  ES384,
  ES512,
};

export const signatureAlgorithms: Algorithm.SignatureAlgorithm[] = [
  ES256,
  ES384,
  ES512,
  EdDSA,
  ES256K,
];

export default alg;
