import transmute, {

} from "../src";


const actor: any = {
  "did": "did:jwk:eyJraWQiOiJ1cm46aWV0ZjpwYXJhbXM6b2F1dGg6andrLXRodW1icHJpbnQ6c2hhLTI1Njo5T1dOcFNWME9SX0t2NzQ1VGZzNllaOGtNY3UtX2EtSG9TNDdvNkNqcUVZIiwia3R5IjoiRUMiLCJjcnYiOiJQLTI1NiIsImFsZyI6IkVTMjU2IiwieCI6IjIwYWdKSnhFaHRMdC1qbGRRNk9BWEtCVzhlVm5pZ0F3TWZPSDdnWjhxeVUiLCJ5IjoiRWRCdGlsLW9QVm1ZdHFIUG84TXZUdURPQzYyUXhsaVVGb2ZBa0c3OUNYVSJ9",
  "key": {
    "publicKey": {
      "kid": "urn:ietf:params:oauth:jwk-thumbprint:sha-256:9OWNpSV0OR_Kv745Tfs6YZ8kMcu-_a-HoS47o6CjqEY",
      "kty": "EC",
      "crv": "P-256",
      "alg": "ES256",
      "x": "20agJJxEhtLt-jldQ6OAXKBW8eVnigAwMfOH7gZ8qyU",
      "y": "EdBtil-oPVmYtqHPo8MvTuDOC62QxliUFofAkG79CXU"
    },
    "privateKey": {
      "kid": "urn:ietf:params:oauth:jwk-thumbprint:sha-256:9OWNpSV0OR_Kv745Tfs6YZ8kMcu-_a-HoS47o6CjqEY",
      "kty": "EC",
      "crv": "P-256",
      "alg": "ES256",
      "x": "20agJJxEhtLt-jldQ6OAXKBW8eVnigAwMfOH7gZ8qyU",
      "y": "EdBtil-oPVmYtqHPo8MvTuDOC62QxliUFofAkG79CXU",
      "d": "n_yCLgJ0hk0LAYeXXUknPb8i85I6E1IkTMwbq4jbilE"
    }
  }
}


const message = "It’s a dangerous business, Frodo, going out your door. 🧠💎";
const payload = new TextEncoder().encode(message);


it("attached sign and verify", async () => {
  const signer = await transmute.cose.signer({ privateKeyJwk: actor.key.privateKey })
  const verifier = await transmute.cose.verifier({ publicKeyJwk: actor.key.publicKey })
  const signature = await signer.sign({
    protectedHeader: {
      kid: 'did:example:123#key-2',
      alg: actor.key.publicKey.alg
    },
    payload
  })
  const verified = await verifier.verify(signature)
  expect(verified).toBeDefined();
});

it("detached sign and verify", async () => {
  const signer = await transmute.cose.detached.signer({ privateKeyJwk: actor.key.privateKey })
  const verifier = await transmute.cose.detached.verifier({ publicKeyJwk: actor.key.publicKey })
  const detached = await signer.sign({
    protectedHeader: {
      kid: 'did:example:123#key-2',
      alg: actor.key.publicKey.alg
    },
    payload
  })
  const verified = await verifier.verify({
    payload: payload,
    signature: detached.signature
  })
  expect(verified).toBe(true);
});
