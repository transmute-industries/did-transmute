import transmute, { SignatureAlgorithm, KeyAgreementAlgorithm } from "../src";

export const getActors = async (
  alg: SignatureAlgorithm | KeyAgreementAlgorithm
) => {
  const issuer = await transmute.did.jwk.exportable({
    alg,
  });
  const verifier = await transmute.did.jwk.exportable({
    alg,
  });
  return {
    issuer: issuer,
    verifier: verifier,
  };
};
