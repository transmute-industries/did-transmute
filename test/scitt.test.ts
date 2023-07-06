import transmute, { DidJwkUrl } from "../src";

const message = "It’s a dangerous business, Frodo, going out your door. 🧠💎";
const payload = new TextEncoder().encode(message);

it("with resolver", async () => {
  const { did, key: { privateKey } } = await transmute.did.jwk.exportable({
    alg: "ES256",
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const signer = await transmute.scitt.signer({ privateKeyJwk: privateKey as any });
  const detached = await signer.sign({
    protectedHeader: {
      kid: 'did:example:123#key-42',
      alg: privateKey.alg,
    },
    payload
  });
  const verifier = transmute.scitt.verifier({
    resolver: {
      dereference: async (id: string) => {
        // You might implement an allowed issuers policy here...
        if (id !== 'did:example:123#key-42') {
          throw new Error('Unsupported issuer')
        }
        try {
          const vm = await transmute.did.jwk.dereference({
            // normally this would be id
            // its hard coded here to pass the test
            // this simulates "knowing (somehow)"
            // which key are associated with an issuer...
            id: did + '#0' as DidJwkUrl,
            documentLoader: transmute.did.jwk.documentLoader,
          });
          return vm.publicKeyJwk;
        } catch (e) {
          throw new Error('Unsupported issuer')
        }
      },
    },
  });
  const verified = await verifier.verify({ payload, signature: detached.signature });
  expect(verified).toBe(true);
});
