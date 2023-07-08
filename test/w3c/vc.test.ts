import transmute from "../../src";

it("vc+ld+jwt", async () => {
  const actor = await transmute.did.jwk.exportable({
    alg: "ES256",
  });
  const signer = transmute.w3c.signer({ privateKey: actor.key.privateKey });
  const claimset = {
    "@context": [
      "https://www.w3.org/ns/credentials/v2",
      "https://www.w3.org/ns/credentials/examples/v2",
    ],
    id: "https://contoso.example/credentials/35327255",
    type: ["VerifiableCredential", "KYCExample"],
    issuer: "did:web:contoso.example",
    validFrom: "2019-05-25T03:10:16.992Z",
    validUntil: "2027-05-25T03:10:16.992Z",
    credentialSchema: {
      id: "https://contoso.example/bafybeigdyr...lqabf3oclgtqy55fbzdi",
      type: "JsonSchema",
    },
    credentialSubject: {
      id: "did:example:1231588",
      type: "Person",
    },
  };
  const vc = await signer.sign({
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
  const verified = await verifier.verify({ jwt: vc });
  expect(verified.claimset).toEqual(claimset);
});
