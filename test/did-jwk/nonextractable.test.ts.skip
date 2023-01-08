/* eslint-disable @typescript-eslint/no-explicit-any */
import transmute from "../../src";

const message = "It’s a dangerous business, Frodo, going out your door. 🧠💎";
const payload = new TextEncoder().encode(message);

it("sign and verify", async () => {
  const alg = transmute.did.jws.alg.EdDSA;
  const e = await transmute.did.jwk.isolated({
    alg,
  });
  const jws = await transmute.sign({
    privateKey: e.key.privateKey,
    protectedHeader: {
      alg,
      iss: e.did,
      kid: "#0",
    },
    payload,
  });
  const v = await transmute.verify({
    jws,
    publicKey: e.key.publicKeyJwk,
  });
  expect(v.protectedHeader.alg).toBe(e.key.publicKeyJwk.alg);
  expect(new TextDecoder().decode(v.payload)).toEqual(message);
});

it("encrypt and decrypt", async () => {
  const alg = transmute.did.jwe.alg.ECDH_ES_A256KW;
  const e = await transmute.did.jwk.isolated({
    alg,
  });
  const jwe = await transmute.encrypt({
    publicKey: e.key.publicKeyJwk,
    protectedHeader: {
      alg: e.key.publicKeyJwk.alg,
      enc: transmute.did.jwe.enc.A256GCM,
    },
    plaintext: payload,
  });
  const v = await transmute.decrypt({
    jwe,
    privateKey: e.key.privateKey,
  });
  expect(v.protectedHeader.alg).toBe(e.key.publicKeyJwk.alg);
  expect(new TextDecoder().decode(v.plaintext)).toEqual(message);
});
