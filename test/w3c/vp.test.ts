import transmute from "../../src";

it("vp+ld+jwt", async () => {
  const actor = await transmute.did.jwk.exportable({
    alg: "ES256",
  });
  const signer = transmute.w3c.signer({ privateKey: actor.key.privateKey });
  const claimset = {
    "@context": ["https://www.w3.org/ns/credentials/v2"],
    type: ["VerifiablePresentation"],
    holder:
      "urn:ietf:params:oauth:jwk-thumbprint:sha-256:_Fpfe27AuGmEljZE9s2lw2UH-qrZLRFNrWbJrWIe4SI",
  };
  const vp = await signer.sign({
    protectedHeader: {
      kid: actor.did + '#0',
      alg: actor.key.publicKey.alg,
    },
    claimset,
  });
  const verifier = transmute.w3c.verifier({
    issuer: async (jwt: string) => {
      const id = transmute.w3c.getPublicKeyIdFromToken(jwt);
      const { publicKeyJwk } = await transmute.did.jwk.dereference({
        id,
        documentLoader: transmute.did.jwk.documentLoader,
      });
      // this resolver MUST return application/jwk+json
      return publicKeyJwk
    },
  });
  const verified = await verifier.verify({ jwt: vp });
  expect(verified.claimset).toEqual(claimset);
});
