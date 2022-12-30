import transmute, { ECDH_ES_A256KW, ExtractableActor } from "../../src";

const message = "hello world";
describe("transmute", () => {
  describe("did", () => {
    describe("jwe", () => {
      it("encrypt & decrypt", async () => {
        const alg = transmute.did.jwe.alg[ECDH_ES_A256KW];
        const actor = await transmute.did.jwk.generate({
          alg,
          extractable: true,
        });
        const actor2 = await transmute.did.jwe.encrypt({
          plaintext: new TextEncoder().encode("hello world"),
          publicKey: actor.key.publicKeyJwk,
        });
        expect(actor2.did.startsWith("did:jwe:")).toBe(true);
        const v = await transmute.did.jwe.decrypt({
          did: actor2.did,
          privateKey: (actor as ExtractableActor).key.privateKeyJwk,
        });
        expect(v.protectedHeader.alg).toBe(actor.key.publicKeyJwk.alg);
        expect(new TextDecoder().decode(v.plaintext)).toEqual(message);
      });
    });
  });
});
