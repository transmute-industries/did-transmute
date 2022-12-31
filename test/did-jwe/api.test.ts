import transmute, { ExportableActor } from "../../src";

const message = "hello world";
describe("transmute", () => {
  describe("did", () => {
    describe("jwe", () => {
      it("encrypt & decrypt", async () => {
        const actor = await transmute.did.jwk.generate({
          alg: transmute.did.jwe.alg.ECDH_ES_A256KW,
          extractable: true,
        });
        const actor2 = await transmute.did.jwe.encrypt({
          publicKey: actor.key.publicKeyJwk,
          plaintext: new TextEncoder().encode("hello world"),
          protectedHeader: {
            alg: actor.key.publicKeyJwk.alg,
            enc: transmute.did.jwe.enc.A256GCM,
          },
        });
        expect(actor2.did.startsWith("did:jwe:")).toBe(true);
        const v = await transmute.did.jwe.decrypt({
          did: actor2.did,
          privateKey: (actor as ExportableActor).key.privateKeyJwk,
        });
        expect(v.protectedHeader.alg).toBe(actor.key.publicKeyJwk.alg);
        expect(new TextDecoder().decode(v.plaintext)).toEqual(message);
      });
    });
  });
});
