import transmute, { ExtractableActor } from "../../src";

it("create", async () => {
  const actor = await transmute.did.jwk.generate({
    alg: "ES256",
    extractable: true,
  });
  const actor2 = await transmute.did.jws.create({
    header: { alg: "ES256" },
    payload: new TextEncoder().encode("hello world"),
    privateKey: (actor as ExtractableActor).key.privateKeyJwk,
  });
  expect(actor2.did.startsWith("did:jws")).toBe(true);
});
