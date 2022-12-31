import transmute, { ExportableActor, DereferenceParameters } from "../../src";

export const getActors = async (alg: any) => {
  const issuer = await transmute.did.jwk.generate({
    alg,
    extractable: true,
  });
  const verifier = await transmute.did.jwk.generate({
    alg,
    extractable: true,
  });
  const trustKeys = {
    [issuer.did + "#0"]: issuer.key,
    [verifier.did + "#0"]: verifier.key,
  };
  const trustStore = {
    dereference: (did: any) => {
      return trustKeys[did];
    },
  };
  return {
    issuer: issuer as ExportableActor,
    verifier: verifier as ExportableActor,
    trustStore,
  };
};

export const claimSet = { "urn:example:claim": true };

export const makeHeader = (data: any) => {
  const protectedHeader = {
    ...data,
    kid: "#0",
    cty: "vnd.mycompany.myapp.customer+json; version=2.0",
  };
  return protectedHeader;
};

export const checks = (
  v: any,
  alg: any,
  protectedHeader: any,
  audience: any
) => {
  expect(v.protectedHeader.alg).toBe(alg);
  expect(v.protectedHeader.iss).toBe(protectedHeader.iss);
  expect(v.protectedHeader.kid).toBe(protectedHeader.kid);
  expect(v.protectedHeader.cty).toBe(protectedHeader.cty);
  expect(v.payload.aud).toBe(audience);
  expect(v.payload["urn:example:claim"]).toBe(true);
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
