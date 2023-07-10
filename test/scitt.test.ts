import transmute, { DidJwkUrl } from "../src";

const message = "It’s a dangerous business, Frodo, going out your door. 🧠💎";
const payload = new TextEncoder().encode(message);

it("with resolver", async () => {
  const actor = await transmute.did.jwk.exportable({
    alg: "ES256",
  });
  const signer = await transmute.scitt.signer({ privateKey: actor.key.privateKey });
  const detached = await signer.sign({
    protectedHeader: {
      kid: 'did:example:123#key-42',
      alg: actor.key.privateKey.alg,
    },
    payload
  });
  const verifier = transmute.scitt.verifier({
    issuer: async (signature: Uint8Array) => {
      const kid = transmute.cose.getKid(signature)
      if (!kid) {
        throw new Error('No kid found, unable to locate key material')
      }
      // You might implement an allowed issuers policy here...
      if (kid !== 'did:example:123#key-42') {
        throw new Error('Unsupported issuer')
      }
      try {
        const { publicKeyJwk } = await transmute.did.jwk.dereference({
          // normally this would be id
          // its hard coded here to pass the test
          // this simulates "knowing (somehow)"
          // which key are associated with an issuer...
          id: actor.did + '#0' as DidJwkUrl,
          documentLoader: transmute.did.jwk.documentLoader,
        });
        return publicKeyJwk;
      } catch (e) {
        throw new Error('Unsupported issuer')
      }
    },
  });
  const verified = await verifier.verify({ payload, signature: detached.signature });
  expect(verified).toBe(true);
});
