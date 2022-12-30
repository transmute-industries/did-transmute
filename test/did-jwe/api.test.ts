import transmute, { ECDH_ES_A256KW, ExtractableActor } from "../../src";

it("create", async () => {
  const alg = transmute.did.jwe.alg[ECDH_ES_A256KW];
  const actor = await transmute.did.jwk.generate({
    alg,
    extractable: true,
  });
  const actor2 = await transmute.did.jwe.create({
    plaintext: new TextEncoder().encode("hello world"),
    publicKey: (actor as ExtractableActor).key.publicKeyJwk,
  });
  expect(actor2.did.startsWith("did:jwe")).toBe(true);
});
