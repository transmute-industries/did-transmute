import transmute from "../src";

const { alg, enc } = transmute.jose;

const message = "It’s a dangerous business, Frodo, going out your door. 🧠💎";
const payload = new TextEncoder().encode(message);

it("transmute.did.jwk.exportable", async () => {
  const actor = await transmute.did.jwk.exportable({
    alg: alg.ES256,
  });
  expect(actor.key.publicKey.alg).toBe(alg.ES256);
  expect(actor.key.privateKey.alg).toBe(alg.ES256);
});

it("transmute.did.jwk.isolated", async () => {
  const actor = await transmute.did.jwk.isolated({
    alg: alg.ES256,
  });
  expect(actor.key.publicKey.alg).toBe(alg.ES256);
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

it("transmute.sign", async () => {
  const {
    key: { privateKey, publicKey },
  } = await transmute.did.jwk.isolated({
    alg: alg.ES256,
  });
  const jws = await transmute.sign({
    privateKey: privateKey,
    protectedHeader: {
      alg: alg.ES256,
    },
    payload,
  });
  const v = await transmute.verify({
    jws,
    publicKey: publicKey,
  });
  expect(v.protectedHeader.alg).toBe(publicKey.alg);
  expect(new TextDecoder().decode(v.payload)).toEqual(message);
});

it("transmute.encrypt", async () => {
  const {
    key: { privateKey, publicKey },
  } = await transmute.did.jwk.isolated({
    alg: alg.ECDH_ES_A256KW,
  });
  const jwe = await transmute.encrypt({
    publicKey: publicKey,
    protectedHeader: {
      alg: publicKey.alg,
      enc: enc.A256GCM,
    },
    plaintext: payload,
  });
  const v = await transmute.decrypt({
    jwe,
    privateKey: privateKey,
  });
  expect(v.protectedHeader.alg).toBe(publicKey.alg);
  expect(new TextDecoder().decode(v.plaintext)).toEqual(message);
});
