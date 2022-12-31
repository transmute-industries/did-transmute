import transmute, {
  DereferenceParameters,
  SignatureAlgorithm,
  KeyAgreementAlgorithm,
} from "../src";

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

// This function must only return verification methods that are trusted.
export const trustedDereferencer = async ({
  didUrl,
}: DereferenceParameters) => {
  if (didUrl.startsWith("did:jwk:")) {
    return transmute.did.jwk.dereference({ didUrl });
  }
  return null;
};
