import transmute from "../../src";

const message = "hello world";
describe("transmute", () => {
  describe("did", () => {
    describe("jwe", () => {
      it("encrypt & decrypt", async () => {
        const actor = await transmute.did.jwk.exportable({
          alg: transmute.did.jwe.alg.ECDH_ES_A256KW,
        });
        const actor2 = await transmute.did.jwe.encrypt({
          publicKey: actor.key.publicKeyJwk,
          protectedHeader: {
            alg: actor.key.publicKeyJwk.alg,
            enc: transmute.did.jwe.enc.A256GCM,
          },
          plaintext: new TextEncoder().encode("hello world"),
        });
        expect(actor2.did.startsWith("did:jwe:")).toBe(true);
        const v = await transmute.did.jwe.decrypt({
          did: actor2.did,
          privateKey: actor.key.privateKeyJwk,
        });
        expect(v.protectedHeader.alg).toBe(actor.key.publicKeyJwk.alg);
        expect(new TextDecoder().decode(v.plaintext)).toEqual(message);
      });
    });
  });
});
