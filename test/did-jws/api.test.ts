import transmute, { ExtractableActor } from "../../src";

it("create", async () => {
  const alg = transmute.did.jws.alg.ES256;
  const actor = await transmute.did.jwk.generate({
    alg,
    extractable: true,
  });
  const actor2 = await transmute.did.jws.create({
    header: { alg },
    payload: new TextEncoder().encode("hello world"),
    privateKey: (actor as ExtractableActor).key.privateKeyJwk,
  });
  expect(actor2.did.startsWith("did:jws")).toBe(true);
});
