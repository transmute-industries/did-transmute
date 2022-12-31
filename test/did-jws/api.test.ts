import transmute, { ExportableActor } from "../../src";

const message = "hello world";
describe("transmute", () => {
  describe("did", () => {
    describe("jws", () => {
      it("sign & verify", async () => {
        const alg = transmute.did.jws.alg.ES256;
        const actor = await transmute.did.jwk.generate({
          alg,
          extractable: true,
        });
        const actor2 = await transmute.did.jws.sign({
          privateKey: (actor as ExportableActor).key.privateKeyJwk,
          protectedHeader: { alg },
          payload: new TextEncoder().encode(message),
        });
        expect(actor2.did.startsWith("did:jws:")).toBe(true);
        const v = await transmute.did.jws.verify({
          did: actor2.did,
          publicKey: actor.key.publicKeyJwk,
        });
        expect(v.protectedHeader.alg).toBe(actor.key.publicKeyJwk.alg);
        expect(new TextDecoder().decode(v.payload)).toEqual(message);
      });
    });
  });
});
