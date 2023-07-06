import transmute, { DidJwkUrl } from "../src";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const actor: any = {
  did: "did:jwk:eyJraWQiOiJ1cm46aWV0ZjpwYXJhbXM6b2F1dGg6andrLXRodW1icHJpbnQ6c2hhLTI1Njo5T1dOcFNWME9SX0t2NzQ1VGZzNllaOGtNY3UtX2EtSG9TNDdvNkNqcUVZIiwia3R5IjoiRUMiLCJjcnYiOiJQLTI1NiIsImFsZyI6IkVTMjU2IiwieCI6IjIwYWdKSnhFaHRMdC1qbGRRNk9BWEtCVzhlVm5pZ0F3TWZPSDdnWjhxeVUiLCJ5IjoiRWRCdGlsLW9QVm1ZdHFIUG84TXZUdURPQzYyUXhsaVVGb2ZBa0c3OUNYVSJ9",
  key: {
    publicKey: {
      kid: "urn:ietf:params:oauth:jwk-thumbprint:sha-256:9OWNpSV0OR_Kv745Tfs6YZ8kMcu-_a-HoS47o6CjqEY",
      kty: "EC",
      crv: "P-256",
      alg: "ES256",
      x: "20agJJxEhtLt-jldQ6OAXKBW8eVnigAwMfOH7gZ8qyU",
      y: "EdBtil-oPVmYtqHPo8MvTuDOC62QxliUFofAkG79CXU",
    },
    privateKey: {
      kid: "urn:ietf:params:oauth:jwk-thumbprint:sha-256:9OWNpSV0OR_Kv745Tfs6YZ8kMcu-_a-HoS47o6CjqEY",
      kty: "EC",
      crv: "P-256",
      alg: "ES256",
      x: "20agJJxEhtLt-jldQ6OAXKBW8eVnigAwMfOH7gZ8qyU",
      y: "EdBtil-oPVmYtqHPo8MvTuDOC62QxliUFofAkG79CXU",
      d: "n_yCLgJ0hk0LAYeXXUknPb8i85I6E1IkTMwbq4jbilE",
    },
  },
};

it("vc+ld+jwt", async () => {
  const signer = transmute.w3c.signer({ privateKey: actor.key.privateKey });
  const verifier = transmute.w3c.verifier({ publicKey: actor.key.publicKey });
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
    header: {
      kid: "did:example:123#key-42",
      alg: actor.key.publicKey.alg,
    },
    claimset,
  });
  const verified = await verifier.verify({ jwt: vc });
  expect(verified.claimset).toEqual(claimset);
});

it("vp+ld+jwt", async () => {
  const signer = transmute.w3c.signer({ privateKey: actor.key.privateKey });
  const verifier = transmute.w3c.verifier({ publicKey: actor.key.publicKey });
  const claimset = {
    "@context": ["https://www.w3.org/ns/credentials/v2"],
    type: ["VerifiablePresentation"],
    holder:
      "urn:ietf:params:oauth:jwk-thumbprint:sha-256:_Fpfe27AuGmEljZE9s2lw2UH-qrZLRFNrWbJrWIe4SI",
  };
  const vp = await signer.sign({
    header: {
      kid: "did:example:123#key-42",
      alg: actor.key.publicKey.alg,
    },
    claimset,
  });
  const verified = await verifier.verify({ jwt: vp });
  expect(verified.claimset).toEqual(claimset);
});

it("with resolver", async () => {
  const actor = await transmute.did.jwk.exportable({
    alg: "ES256",
  });
  const signer = transmute.w3c.signer({ privateKey: actor.key.privateKey });
  const vp = await signer.sign({
    header: {
      kid: actor.did + '#0',
      alg: actor.key.publicKey.alg,
    },
    claimset: {
      "@context": ["https://www.w3.org/ns/credentials/v2"],
      type: ["VerifiablePresentation"],
      holder:
        "urn:ietf:params:oauth:jwk-thumbprint:sha-256:_Fpfe27AuGmEljZE9s2lw2UH-qrZLRFNrWbJrWIe4SI",
    },
  });
  const verifier = transmute.w3c.verifier({
    resolver: {
      dereference: async (id: string) => {
        // You might implement an allowed issuers policy here...
        const vm = await transmute.did.jwk.dereference({
          id: id as DidJwkUrl,
          documentLoader: transmute.did.jwk.documentLoader,
        });
        if (!vm.publicKeyJwk) {
          throw new Error("No public key found");
        }
        return vm.publicKeyJwk;
      },
    },
  });
  const verified = await verifier.verify({ jwt: vp });
  expect(verified.claimset).toBeDefined();
});
