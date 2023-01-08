import transmute from "../src";

const { alg } = transmute.jose;

it("transmute.did.jwk.exportable", async () => {
  const actor = await transmute.did.jwk.exportable({
    alg: alg.ES256,
  });
  expect(actor.key.publicKeyJwk.alg).toBe(alg.ES256);
  expect(actor.key.privateKeyJwk.alg).toBe(alg.ES256);
});

it("transmute.did.jwk.isolated", async () => {
  const actor = await transmute.did.jwk.isolated({
    alg: alg.ES256,
  });
  expect(actor.key.publicKeyJwk.alg).toBe(alg.ES256);
  expect(actor.key.privateKey).toBeDefined();
});

it("transmute.did.jwk.resolve", async () => {
  const { did } = await transmute.did.jwk.exportable({
    alg: alg.ES256,
  });
  const didDocument = await transmute.did.jwk.resolve({
    id: did,
    documentLoader: transmute.did.jwk.documentLoader,
  });
  expect(didDocument.id).toBe(did);
});

it("transmute.did.jwk.dereference", async () => {
  const { did } = await transmute.did.jwk.exportable({
    alg: alg.ES256,
  });
  const verificationMethod = await transmute.did.jwk.dereference({
    id: `${did}#0`,
    documentLoader: transmute.did.jwk.documentLoader,
  });
  expect(verificationMethod.id).toBe(`#0`);
  expect(verificationMethod.type).toBe(`JsonWebKey2020`);
  expect(verificationMethod.controller).toBe(did);
  expect(verificationMethod.publicKeyJwk.alg).toBe(alg.ES256);
});
