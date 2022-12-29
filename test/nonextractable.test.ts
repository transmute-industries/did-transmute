/* eslint-disable @typescript-eslint/no-explicit-any */
import transmute from "../src";
import { ECDH_ES_A256KW } from "../src/did-methods/did-jwe/alg";

const message = "It’s a dangerous business, Frodo, going out your door. 🧠💎";
const payload = new TextEncoder().encode(message);

it("sign and verify", async () => {
  const alg = transmute.did.jws.alg.EdDSA;
  const e: any = await transmute.did.jwk.generate({
    alg,
    extractable: false,
  });
  const jws = await transmute.did.jwk.sign({
    payload,
    privateKey: e.key.privateKey,
    header: {
      alg,
      iss: e.did,
      kid: "#0",
    },
  });
  const v = await transmute.did.jwk.verify({
    jws,
    publicKeyJwk: e.key.publicKeyJwk,
  });
  expect(v.protectedHeader.alg).toBe(e.key.publicKeyJwk.alg);
  expect(new TextDecoder().decode(v.payload)).toEqual(message);
});

it("encrypt and decrypt", async () => {
  const alg = transmute.did.jwe.alg[ECDH_ES_A256KW];
  const e: any = await transmute.did.jwk.generate({
    alg,
    extractable: false,
  });
  const jwe = await transmute.did.jwk.encrypt({
    plaintext: payload,
    publicKey: e.key.publicKeyJwk,
  });
  const v = await transmute.did.jwk.decrypt({
    jwe,
    privateKey: e.key.privateKey,
  });
  expect(v.protectedHeader.alg).toBe(e.key.publicKeyJwk.alg);
  expect(new TextDecoder().decode(v.plaintext)).toEqual(message);
});
