import transmute, {
  ExportableActor,
  DereferenceParameters,
  SignatureAlgorithm,
  KeyAgreementAlgorithm,
} from "../src";

export const getActors = async (
  alg: SignatureAlgorithm | KeyAgreementAlgorithm
) => {
  const issuer = await transmute.did.jwk.generate({
    alg,
    extractable: true,
  });
  const verifier = await transmute.did.jwk.generate({
    alg,
    extractable: true,
  });
  return {
    issuer: issuer as ExportableActor,
    verifier: verifier as ExportableActor,
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
