import transmute, { PublicKeyJwk } from "../src";
import { DidJwk } from "../src/did-jwk/types";

const { alg, enc } = transmute.jose;

const message = "It’s a dangerous business, Frodo, going out your door. 🧠💎";
const payload = new TextEncoder().encode(message);

it("transmute.did.jwk.exportable", async () => {
  const actor = await transmute.did.jwk.exportable({
    alg: alg.ES256,
  });
  expect(actor.key.publicKey.alg).toBe(alg.ES256);
  expect(actor.key.privateKey.alg).toBe(alg.ES256);
});

it("transmute.did.jwk.isolated", async () => {
  const actor = await transmute.did.jwk.isolated({
    alg: alg.ES256,
  });
  expect(actor.key.publicKey.alg).toBe(alg.ES256);
  expect(actor.key.privateKey).toBeDefined();
});

it("transmute.did.jwk.resolve", async () => {
  const { did } = await transmute.did.jwk.exportable({
    alg: alg.ES256,
  });
  const didDocument = await transmute.did.jwk.resolve({
    id: did,
    documentLoader: transmute.did.jwk.documentLoader,
  });
  expect(didDocument.id).toBe(did);
});

it("transmute.did.jwk.dereference", async () => {
  const { did } = await transmute.did.jwk.exportable({
    alg: alg.ES256,
  });
  const verificationMethod = await transmute.did.jwk.dereference({
    id: `${did}#0`,
    documentLoader: transmute.did.jwk.documentLoader,
  });
  expect(verificationMethod.id).toBe(`#0`);
  expect(verificationMethod.type).toBe(`JsonWebKey2020`);
  expect(verificationMethod.controller).toBe(did);
  expect(verificationMethod.publicKeyJwk.alg).toBe(alg.ES256);
});

it("transmute.sign", async () => {
  const {
    key: { privateKey, publicKey },
  } = await transmute.did.jwk.isolated({
    alg: alg.ES256,
  });
  const jws = await transmute.sign({
    privateKey: privateKey,
    protectedHeader: {
      alg: alg.ES256,
    },
    payload,
  });
  const v = await transmute.verify({
    jws,
    publicKey: publicKey,
  });
  expect(v.protectedHeader.alg).toBe(publicKey.alg);
  expect(new TextDecoder().decode(v.payload)).toEqual(message);
});

it("transmute.encrypt", async () => {
  const {
    key: { privateKey, publicKey },
  } = await transmute.did.jwk.isolated({
    alg: alg.ECDH_ES_A256KW,
  });
  const jwe = await transmute.encrypt({
    publicKey: publicKey,
    protectedHeader: {
      alg: publicKey.alg,
      enc: enc.A256GCM,
    },
    plaintext: payload,
  });
  const v = await transmute.decrypt({
    jwe,
    privateKey: privateKey,
  });
  expect(v.protectedHeader.alg).toBe(publicKey.alg);
  expect(new TextDecoder().decode(v.plaintext)).toEqual(message);
});

it("transmute.did.jwt.sign", async () => {
  const issuer = await transmute.did.jwk.exportable({
    alg: alg.ES256,
  });
  const subject = await transmute.did.jwt.sign({
    issuer: "did:example:123",
    audience: "did:example:456",
    protectedHeader: {
      alg: issuer.key.publicKey.alg,
    },
    claimSet: {
      "urn:example:claim": true,
    },
    privateKey: issuer.key.privateKey,
  });
  const verifiedSubject = await transmute.did.jwt.verify({
    did: subject.did,
    issuer: "did:example:123",
    audience: "did:example:456",
    publicKey: issuer.key.publicKey,
  });
  expect(verifiedSubject.protectedHeader.alg).toBe(issuer.key.publicKey.alg);
  expect(verifiedSubject.payload["urn:example:claim"]).toBe(true);
});

// kill this
it("transmute.did.jwt.actor", async () => {
  // implicit extractable
  const subject = await transmute.did.jwt.actor({
    protectedHeader: {
      alg: alg.ES256,
    },
    claimSet: {
      "urn:example:claim": true,
    },
  });
  expect(subject.root.did.startsWith("did:jwk")).toBe(true);
  expect(subject.root.key.publicKey.alg).toBe(alg.ES256);
  expect(subject.root.key.privateKey.alg).toBe(alg.ES256);
  expect(subject.delegate.did.startsWith("did:jwt")).toBe(true);
});

describe("transmute.did.jwt.resolve", () => {
  it("embedded-jwk", async () => {
    const issuer = await transmute.did.jwk.exportable({
      alg: alg.ES256,
    });
    const subject = await transmute.did.jwt.sign({
      issuer: "did:example:123",
      audience: "did:example:456",
      protectedHeader: {
        alg: issuer.key.publicKey.alg,
        jwk: issuer.key.publicKey,
        iss: issuer.did,
        kid: `#0`,
      },
      claimSet: {
        "urn:example:claim": true,
      },
      privateKey: issuer.key.privateKey,
    });
    const didDocument = await transmute.did.jwt.resolve({
      id: subject.did,
      documentLoader: async (id: string) => {
        if (id.startsWith("did:jwk")) {
          return transmute.did.jwk.documentLoader(id as DidJwk);
        }
        throw new Error("documentLoader does not support identifier: " + id);
      },
      profiles: ["embedded-jwk"], // This part.
    });
    expect(didDocument.id.startsWith("did:jwt")).toBe(true);
    expect(didDocument["urn:example:claim"]).toBe(true);
  });

  it("relative-did-url", async () => {
    const issuer = await transmute.did.jwk.exportable({
      alg: alg.ES256,
    });
    const subject = await transmute.did.jwt.sign({
      issuer: "did:example:123",
      audience: "did:example:456",
      protectedHeader: {
        alg: issuer.key.publicKey.alg,
        iss: "did:example:123", // generic issuer.
        kid: `#0`,
      },
      claimSet: {
        "urn:example:claim": true,
      },
      privateKey: issuer.key.privateKey,
    });
    const didDocument = await transmute.did.jwt.resolve({
      id: subject.did,
      documentLoader: async (id: string) => {
        if (id.startsWith("did:example:123")) {
          return transmute.did.jwk.documentLoader(issuer.did);
        }
        throw new Error("documentLoader does not support identifier: " + id);
      },
      profiles: ["relative-did-url"], // This part.
    });
    expect(didDocument.id.startsWith("did:jwt")).toBe(true);
    expect(didDocument["urn:example:claim"]).toBe(true);
  });

  it("access_token", async () => {
    const issuer = await transmute.did.jwk.exportable({
      alg: alg.ES256,
    });
    const subject = await transmute.did.jwt.sign({
      issuer: "https://contoso.auth0.com/",
      audience: [
        "https://example.com/health-api",
        "https://contoso.auth0.com/userinfo",
      ],
      protectedHeader: {
        alg: issuer.key.publicKey.alg,
        typ: "JWT",
        kid: "zwY7_3TbTHDUUddVLtK4y",
      },
      claimSet: {
        iss: "https://contoso.auth0.com/",
        sub: "auth0|123456",
        azp: "my_client_id",
        scope: "openid profile read:patients read:admin",
      },
      privateKey: issuer.key.privateKey,
    });
    const didDocument = await transmute.did.jwt.resolve({
      id: subject.did,
      documentLoader: async (id: string) => {
        if (id.startsWith("https://contoso.auth0.com/")) {
          const [iss, kid] = id.split("#");
          const didDocument =
            transmute.did.oidc.didDocument<"https://contoso.auth0.com/">({
              iss,
              // set the public key manually
              jwks: [{ ...issuer.key.publicKey, kid }],
              // get the public key via OIDC Discovery
              // jwk: await transmute.oidc.getPublicKey({iss, kid})
            });
          return { document: didDocument };
        }
        throw new Error("documentLoader does not support identifier: " + id);
      },
      profiles: ["access_token"],
    });
    expect(didDocument.id.startsWith("did:jwt")).toBe(true);
    expect(didDocument.scope).toBe("openid profile read:patients read:admin");
  });
});

it("transmute.did.oidc.resolve", async () => {
  const iss = "https://contoso.auth0.com/";
  const didDocument = await transmute.did.oidc.resolve({
    iss,
  });
  expect(didDocument.id).toBe(iss);
});

it("transmute.did.oidc.getPublicKey", async () => {
  const iss = "https://contoso.auth0.com/";
  const kid = `NTBGNTJEMDc3RUE3RUVEOTM4NDcyOEFDNzEyOTY5NDNGOUQ4OEU5OA`;
  const publicKeyJwk = await transmute.did.oidc.getPublicKey({ iss, kid });
  expect(publicKeyJwk.kid).toBe(kid);
});
