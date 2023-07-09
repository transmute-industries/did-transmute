import transmute from "../src";

const message = "It’s a dangerous business, Frodo, going out your door. 🧠💎";
const payload = new TextEncoder().encode(message);

it("attached sign and verify", async () => {
  const actor = await transmute.did.jwk.exportable({
    alg: "ES256",
  });
  const signer = await transmute.cose.signer({ privateKeyJwk: actor.key.privateKey as any })
  const verifier = await transmute.cose.verifier({ publicKeyJwk: actor.key.publicKey as any })
  const signature = await signer.sign({
    protectedHeader: {
      kid: 'did:example:123#key-2',
      alg: actor.key.publicKey.alg
    },
    payload
  })
  const verified = await verifier.verify(signature)
  expect(verified).toBeDefined();
});

it("detached sign and verify", async () => {
  const actor = await transmute.did.jwk.exportable({
    alg: "ES256",
  });
  const signer = await transmute.cose.detached.signer({ privateKeyJwk: actor.key.privateKey as any })
  const verifier = await transmute.cose.detached.verifier({ publicKeyJwk: actor.key.publicKey as any })
  const detached = await signer.sign({
    protectedHeader: {
      kid: 'did:example:123#key-2',
      alg: actor.key.publicKey.alg
    },
    payload
  })
  const verified = await verifier.verify({
    payload: payload,
    signature: detached.signature
  })
  expect(verified).toBe(true);
});
