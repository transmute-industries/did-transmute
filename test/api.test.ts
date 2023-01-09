import transmute, { DidJwk, AnyDidLike } from "../src";

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
      profiles: ["embedded-jwk"],
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
      profiles: ["relative-did-url"],
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
      documentLoader: async (id: AnyDidLike) => {
        if (id.startsWith("https://contoso.auth0.com/")) {
          const [iss, kid] = id.split("#");
          const didDocument =
            transmute.did.oidc.didDocument<"https://contoso.auth0.com/">({
              iss,
              // set the public key manually
              jwks: [{ ...issuer.key.publicKey, kid }],
              // get the public key via OIDC Discovery
              // jwks: await transmute.oidc.getIssuerKeys({iss})
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

it.skip("transmute.did.oidc.resolve", async () => {
  const iss = "https://contoso.auth0.com/";
  const didDocument = await transmute.did.oidc.resolve({
    iss,
  });
  expect(didDocument.id).toBe(iss);
});

it.skip("transmute.did.oidc.getPublicKey", async () => {
  const iss = "https://contoso.auth0.com/";
  const kid = `NTBGNTJEMDc3RUE3RUVEOTM4NDcyOEFDNzEyOTY5NDNGOUQ4OEU5OA`;
  const publicKeyJwk = await transmute.did.oidc.getPublicKey({ iss, kid });
  expect(publicKeyJwk.kid).toBe(kid);
});

it("transmute.did.jwt.dereference", async () => {
  const issuer = await transmute.did.jwk.exportable({
    alg: alg.ES256,
  });
  const subject = await transmute.did.jwt.sign({
    issuer: "did:example:123",
    audience: "did:example:456",
    protectedHeader: {
      alg: issuer.key.publicKey.alg,
      jwk: issuer.key.publicKey,
    },
    claimSet: {
      service: [
        {
          id: "#dwn",
          type: "DecentralizedWebNode",
          serviceEndpoint: {
            nodes: ["https://dwn.example.com", "https://example.org/dwn"],
          },
        },
      ],
    },
    privateKey: issuer.key.privateKey,
  });
  type DwnService = {
    id: "#dwn";
    type: "DecentralizedWebNode";
    serviceEndpoint: {
      nodes: ["https://dwn.example.com", "https://example.org/dwn"];
    };
  };
  const service = await transmute.did.jwt.dereference<DwnService>({
    id: `${subject.did}#dwn`,
    documentLoader: async (id: string) => {
      if (id.startsWith("did:jwk")) {
        return transmute.did.jwk.documentLoader(id as DidJwk);
      }
      throw new Error("documentLoader does not support identifier: " + id);
    },
    profiles: ["embedded-jwk"],
  });
  expect(service.id).toBe("#dwn");
  expect(service.type).toBe("DecentralizedWebNode");
});

it("transmute.did.jwt.encrypt", async () => {
  const issuer = await transmute.did.jwk.exportable({
    alg: alg.ECDH_ES_A256KW,
  });
  const subject = await transmute.did.jwt.encrypt({
    issuer: issuer.did,
    protectedHeader: {
      alg: issuer.key.publicKey.alg,
      enc: transmute.jose.enc.A256GCM,
    },
    claimSet: {
      yolo: 1,
    },
    publicKey: issuer.key.publicKey,
  });
  const v = await transmute.did.jwt.decrypt({
    did: subject.did,
    issuer: issuer.did,
    privateKey: issuer.key.privateKey,
  });
  expect(v.payload.yolo).toBe(1);
});

it("transmute.did.jwt.resolve", async () => {
  const issuer = await transmute.did.jwk.exportable({
    alg: alg.ECDH_ES_A256KW,
  });
  const subject = await transmute.did.jwt.encrypt({
    issuer: "did:example:123",
    protectedHeader: {
      alg: issuer.key.publicKey.alg,
      iss: "did:example:123",
      kid: "#0",
      enc: transmute.jose.enc.A256GCM,
    },
    claimSet: {
      yolo: 1,
    },
    publicKey: issuer.key.publicKey,
  });
  const didDocument = await transmute.did.jwt.resolve({
    id: subject.did,
    privateKeyLoader: async (id: string) => {
      if (id.startsWith("did:example:123")) {
        return issuer.key.privateKey;
      }
      throw new Error("privateKeyLoader does not support identifier: " + id);
    },
    profiles: ["encrypted-jwt"],
  });
  expect(didDocument.yolo).toBe(1);
});

it("transmute.did.jwt.dereference", async () => {
  const issuer = await transmute.did.jwk.exportable({
    alg: alg.ECDH_ES_A256KW,
  });
  const subject = await transmute.did.jwt.encrypt({
    issuer: "did:example:123",
    protectedHeader: {
      alg: issuer.key.publicKey.alg,
      iss: "did:example:123",
      kid: "#0",
      enc: transmute.jose.enc.A256GCM,
    },
    claimSet: {
      service: [
        {
          id: "#dwn",
          type: "DecentralizedWebNode",
          serviceEndpoint: {
            nodes: ["https://dwn.example.com", "https://example.org/dwn"],
          },
        },
      ],
    },
    publicKey: issuer.key.publicKey,
  });
  type DwnService = {
    id: "#dwn";
    type: "DecentralizedWebNode";
    serviceEndpoint: {
      nodes: ["https://dwn.example.com", "https://example.org/dwn"];
    };
  };
  const service = await transmute.did.jwt.dereference<DwnService>({
    id: `${subject.did}#dwn`,
    privateKeyLoader: async (id: string) => {
      if (id.startsWith("did:example:123")) {
        return issuer.key.privateKey;
      }
      throw new Error("privateKeyLoader does not support identifier: " + id);
    },
    profiles: ["encrypted-jwt"],
  });
  expect(service.id).toBe("#dwn");
  expect(service.type).toBe("DecentralizedWebNode");
});

it("transmute.did.web.exportable", async () => {
  const { did, didDocument, key } = await transmute.did.web.exportable({
    url: "https://id.gs1.transmute.example/01/9506000134352",
    alg: transmute.jose.alg.ES256,
    documentLoader: transmute.did.jwk.documentLoader,
  });
  expect(did).toBe("did:web:id.gs1.transmute.example:01:9506000134352");
  expect(didDocument.id).toBe(
    "did:web:id.gs1.transmute.example:01:9506000134352"
  );
  expect(key.privateKey).toBeDefined();
});

it("transmute.did.web.fromPrivateKey", async () => {
  const {
    key: { privateKey },
  } = await transmute.did.jwk.exportable({
    alg: "ES256",
  });
  const issuer = await transmute.did.web.fromPrivateKey({
    url: "https://id.gs1.transmute.example/01/9506000134352",
    privateKey: privateKey,
  });
  expect(issuer.did).toBe("did:web:id.gs1.transmute.example:01:9506000134352");
  expect(issuer.didDocument.id).toBe(
    "did:web:id.gs1.transmute.example:01:9506000134352"
  );
  expect(issuer.key.publicKey).toBeDefined();
  expect(issuer.key.privateKey).toBeDefined();
});

it("transmute.did.web.fromDids", async () => {
  const { did } = await transmute.did.jwk.exportable({
    alg: "ES256",
  });
  const issuer = await transmute.did.web.fromDids({
    url: "https://id.gs1.transmute.example/01/9506000134352",
    dids: [did],
    documentLoader: transmute.did.jwk.documentLoader,
  });
  expect(issuer.did).toBe("did:web:id.gs1.transmute.example:01:9506000134352");
  expect(issuer.didDocument.id).toBe(
    "did:web:id.gs1.transmute.example:01:9506000134352"
  );
});

it("transmute.did.web.resolve", async () => {
  const {
    key: { privateKey },
  } = await transmute.did.jwk.exportable({
    alg: "ES256",
  });
  const issuer = await transmute.did.web.fromPrivateKey({
    url: "https://id.gs1.transmute.example/01/9506000134352",
    privateKey: privateKey,
  });
  const didDocument = await transmute.did.web.resolve({
    id: issuer.did,
    documentLoader: async (iri: string) => {
      // for test purposes.
      if (
        iri === "https://id.gs1.transmute.example/01/9506000134352/did.json"
      ) {
        return { document: issuer.didDocument };
      }
      throw new Error("Unsupported IRI " + iri);
    },
  });
  expect(didDocument.id).toBe(
    "did:web:id.gs1.transmute.example:01:9506000134352"
  );
});

it("transmute.did.web.dereference", async () => {
  const issuer = await transmute.did.web.fromPrivateKey({
    url: "https://id.gs1.transmute.example/01/9506000134352",
    privateKey: {
      kid: "urn:ietf:params:oauth:jwk-thumbprint:sha-256:a9EEmV5OPmFQlAVU2EDuKB3cp5JpirRwnD12UdHc91Q",
      kty: "EC",
      crv: "P-256",
      alg: "ES256",
      x: "D1ygYPasDI88CrYAF_Ga_4aXEhp5fWetEXzyitdt1K8",
      y: "dkxXWzis0tQQIctZRzSvf6tdeITCLXim8HgTUhMOTrg",
      d: "RWgQ966yzek12KSlDJ-hmlqckRUhZzKDqJeM_QdbT-E",
    },
  });
  const verificationMethod = await transmute.did.web.dereference({
    id: `${issuer.did}#a9EEmV5OPmFQlAVU2EDuKB3cp5JpirRwnD12UdHc91Q`,
    documentLoader: async (iri: string) => {
      // for test purposes.
      if (
        iri === "https://id.gs1.transmute.example/01/9506000134352/did.json"
      ) {
        return { document: issuer.didDocument };
      }
      throw new Error("Unsupported IRI " + iri);
    },
  });
  expect(verificationMethod.controller).toBe(
    "did:web:id.gs1.transmute.example:01:9506000134352"
  );
  expect(verificationMethod.id).toBe(
    "#a9EEmV5OPmFQlAVU2EDuKB3cp5JpirRwnD12UdHc91Q"
  );
  expect(verificationMethod.publicKeyJwk).toBeDefined();
});
