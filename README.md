# did:transmute

[![CI](https://github.com/transmute-industries/did-transmute/actions/workflows/ci.yml/badge.svg)](https://github.com/transmute-industries/did-transmute/actions/workflows/ci.yml)
![Branches](./badges/coverage-branches.svg)
![Functions](./badges/coverage-functions.svg)
![Lines](./badges/coverage-lines.svg)
![Statements](./badges/coverage-statements.svg)
![Jest coverage](./badges/coverage-jest%20coverage.svg)

<!-- [![NPM](https://nodei.co/npm/@transmute/did-transmute.png?mini=true)](https://npmjs.org/package/@transmute/did-transmute) -->

<img src="./transmute-banner.png" />

#### [Questions? Contact Transmute](https://transmute.typeform.com/to/RshfIw?typeform-source=did-transmute)

This repository contains experimental implementations of various [DID Methods](https://www.w3.org/TR/did-core/).

A primary use case for this is "DID Method Projection", in which an existing identifier space such as 
all JWK or JWT, is projected into a Decentralizied Identifier space, such as `did:jwk:` or `did:jwt`.

This is accomplished by defining resolution and dereferencing for the DID URLs under the "projection method".

The prefixing might be removed as part of a standardization process.

For example: `did:corporate:example:123` might become `did:example:123` if doing so improves interoperability.

### Composition

```mermaid
%%{
  init: {
    'flowchart': { 'curve': 'monotoneX' },
    'theme': 'base',
    'themeVariables': {
      'primaryColor': '#2a2d4c',
      'primaryTextColor': '#565a7c',
      'nodeBorder': '#565a7c',
      'edgeLabelBackground': '#2a2d4c',
      'clusterBkg': '#2a2d4c',
      'clusterBorder': '#2a2d4c',
      'lineColor': '#565a7c',
      'fontFamily': 'monospace',
      'darkmode': true
    }
  }
}%%
%% Support https://transmute.industries
graph LR
	subgraph &nbsp
		direction LR
        root("did:corporate:web:  ")
        0("did:jwk: base64url ( json-web-key ) ")
        1("did:jwt: compact-json-web-token ")
        2("did:jws: compact-json-web-signature ")
        3("did:jwe: compact-json-web-encryption ")
        root -- derive -->  0
        0 -- issue --> 1
        0 -- sign --> 2
        0 -- encrypt --> 3
        root -- derive -->  1
	end

style root color: #fff, fill: #594aa8
style 0 color: #fcb373, stroke: #fcb373
style 1 color: #fcb373, stroke: #fcb373
style 2 color: #8286a3, stroke: #8286a3
linkStyle 0,4 color:#2cb3d9, stroke-width: 2.0px
linkStyle 1,2,3 color:#ff605d, stroke:#8286a3, stroke-width: 2.0px
%% export const transmute = {
%%   primary: {
%%     purple: { dark: "#27225b", light: "#594aa8" },
%%     red: "#ff605d",
%%     orange: "#fcb373",
%%     grey: "#f5f7fd",
%%     white: "#fff",
%%   },
%%   secondary: {
%%     teal: "#48caca",
%%     aqua: "#2cb3d9",
%%     dark: "#2a2d4c",
%%     medium: "#565a7c",
%%     light: "#8286a3",
%%   },
%% };
```

## Usage

```bash
npm install '@transmute/did-transmute'
```

```ts
import transmute from '@transmute/did-transmute';
```

```js
const transmute = require('@transmute/did-transmute');
```

## did:jwk

### Generate

```ts
const actor1 = await transmute.did.jwk.exportable({
  alg: 'ES256',
});
// Use software isolation: 
// See https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/exportKey
const actor2 = await transmute.did.jwk.isolated({
  alg: 'ES256',
});
```

### Resolve & Dereference

```ts
const { 
  did 
} = await transmute.did.jwk.exportable({
  alg: 'ES256',
});
const didDocument = await transmute.did.jwk.resolve({ did });
// See https://www.w3.org/TR/did-core/#verification-relationships
const { publicKeyJwk } = await transmute.did.jwk.dereference({
  didUrl: `${did}#0`,
  resolver: transmute.did.jwk.resolve,
});
```

### Sign & Verify

```ts
const { 
  key: { privateKeyJwk, publicKeyJwk } 
} = await transmute.did.jwk.exportable({
  alg: transmute.did.jws.alg.ES256,
});
const jws = await transmute.sign({
  privateKey: privateKeyJwk,
  protectedHeader: {
    alg: privateKeyJwk.alg,
  },
  payload: new TextEncoder().encode("It’s a dangerous business, Frodo, going out your door. 🧠💎"),
});
const v = await transmute.verify({
  jws,
  publicKey: publicKeyJwk,
});
```

### Encrypt & Decrypt

```ts
const { 
  key: { privateKeyJwk, publicKeyJwk } 
} = await transmute.did.jwk.exportable({
  alg: transmute.did.jwe.alg.ECDH_ES_A256KW,
});
const jwe = await transmute.encrypt({
  publicKey: publicKeyJwk,
  plaintext: new TextEncoder().encode("It’s a dangerous business, Frodo, going out your door. 🧠💎"),
  protectedHeader: {
    alg: publicKeyJwk.alg,
    enc: transmute.did.jwe.enc.A256GCM,
  },
});
const v = await transmute.decrypt({
  jwe,
  privateKey: privateKeyJwk,
});
```

## did:jwt

This method is very 🚧 experimental 🏗️.

```mermaid
%%{
  init: {
    'theme': 'base',
    'themeVariables': {
      'primaryColor': '#2a2d4c',
      'primaryTextColor': '#565a7c',
      'nodeBorder': '#565a7c',
      'edgeLabelBackground': '#2a2d4c',
      'clusterBkg': '#2a2d4c',
      'clusterBorder': '#2a2d4c',
      'lineColor': '#565a7c',
      'fontFamily': 'monospace',
      'darkmode': true
    }
  }
}%%
%% Support https://transmute.industries
graph LR
	subgraph &nbsp
		direction LR
    Did("did:jwt: compact-json-web-token ")
    KeyDereference{"Key Resolver"}
    DidResolution{"Did Resolution"}
    DidDocument("Did Document")
    DidDocumentMetadata("Did Document Metadata")
    ProtectedHeader("ProtectedHeader")
    ClaimSet("Claim Set")
    Trusted{{"Is Issuer Trusted?"}}
    Untrusted("No")

    Did -- Protected Header  --> KeyDereference
    KeyDereference --> Trusted
    
    Trusted -- Payload --> DidResolution
    DidResolution --> DidDocument
    DidDocument --> ClaimSet
    DidResolution -.-> DidDocumentMetadata
    DidDocumentMetadata -.-> ProtectedHeader

    Trusted -.-> Untrusted

	end

%% orange
style Did color: #fcb373, stroke: #fcb373
style DidDocument color: #fcb373, stroke: #fcb373

%% teal
style Trusted color: #27225b, fill: #2cb3d9

%% purple
style ProtectedHeader color: #fff, fill: #594aa8
style ClaimSet color: #fff, fill: #594aa8

%% light grey
style DidDocumentMetadata color: #8286a3, stroke: #8286a3

%% red
style KeyDereference color: #ff605d, stroke: #ff605d
style DidResolution color: #ff605d, stroke: #ff605d


%% red lines
linkStyle 0,2 color:#ff605d, stroke-width: 2.0px

%% linkStyle 1,2,4 color:#ff605d, stroke:#8286a3, stroke-width: 2.0px
%% export const transmute = {
%%   primary: {
%%     purple: { dark: "#27225b", light: "#594aa8" },
%%     red: "#ff605d",
%%     orange: "#fcb373",
%%     grey: "#f5f7fd",
%%     white: "#fff",
%%   },
%%   secondary: {
%%     teal: "#48caca",
%%     aqua: "#2cb3d9",
%%     dark: "#2a2d4c",
%%     medium: "#565a7c",
%%     light: "#8286a3",
%%   },
%% };
```

There are several different ways to "trust" a JSON Web Token issuer, based `exclusively` or the `header` and `verify` or `decrypt` operations.

🔥 Only `embedded jwk` is supported currently.

### Embedding keys

Using [jwk](https://www.rfc-editor.org/rfc/rfc7515.html#section-4.1.3) and [x5c](https://www.rfc-editor.org/rfc/rfc7515.html#section-4.1.6).

> Embedding the key within the token is a straightforward way to enable key distribution. To ensure the security of this mechanism, the consumer of the JWT needs to restrict which keys it accepts. Failure to do so allows an attacker to generate tokens signed with a malicious private key. An overly permitting consumer would merely use the embedded public key to verify the signature, which will be valid. To avoid such issues, the consumer needs to match the key used against a set of explicitly whitelisted keys. In case the key comes in the form of an X509 certificate, the consumer can use the certificate information to verify the authenticity.

- [Source](https://www.pingidentity.com/en/resources/blog/post/jwt-security-nobody-talks-about.html)


When `jwk` is present in the `Protected Header` of a `JWT`, a custom `did:jwk` resoler will be used as the the `allow-list`.

A `null` resolution is treated as a `deny` operation.


See also [panva/jose](https://github.com/panva/jose/blob/HEAD/docs/functions/jwk_embedded.EmbeddedJWK.md#readme).

### Distributing keys

Using [jku](https://www.rfc-editor.org/rfc/rfc7515.html#section-4.1.2) and [x5u](https://www.rfc-editor.org/rfc/rfc7515.html#section-4.1.5).

## TODO

See [RFC7515](https://www.rfc-editor.org/rfc/rfc7515.html)

#### Proof of Possession

## TODO

See [RFC7800](https://www.rfc-editor.org/rfc/rfc7800.html#section-3)


### Using OpenID Connect Discovery

## TODO

See [openid-connect-discovery](https://openid.net/specs/openid-connect-discovery-1_0-21.html)

#### Verifiable Credential's JSON Web Token Profile

This approach relies on the `resolver` to act as an allow list for `absolute did urls`, constructed from `kid` or a combination of `kid` and `iss`.

For example, a `protectedHeader` might look like:

```json
{
  "alg": "ES256",
  "iss": "did:example:123",
  "kid": "#key-4"
}
```

or 

```json
{
  "alg": "ES256",
  "kid": "did:example:123#key-4"
}
```

This header will be used to dereference a `verificationMethod` which is expected to contain a `publicKeyJwk`.

For example:

```json
{
  "id": "#key-4",
  "type": "JsonWebKey2020",
  "controller": "did:example:123",
  "publicKeyJwk": {
    "kid": "urn:ietf:params:oauth:jwk-thumbprint:sha-256:AXRYM9BnKWZj6c84ykLX6D-fE9FRV2_f3pRDwcJGSU0",
    "kty": "OKP",
    "crv": "Ed25519",
    "alg": "EdDSA",
    "x": "dh2c41edqveCxEzw3OVjtAmdcJPwe4lAg2fJ10rsZk0",
  }
}
```

or

```json
{
  "id": "did:example:123#urn:ietf:params:oauth:jwk-thumbprint:sha-256:AXRYM9BnKWZj6c84ykLX6D-fE9FRV2_f3pRDwcJGSU0",
  "type": "JsonWebKey2020",
  "controller": "did:example:123",
  "publicKeyJwk": {
    "kid": "urn:ietf:params:oauth:jwk-thumbprint:sha-256:AXRYM9BnKWZj6c84ykLX6D-fE9FRV2_f3pRDwcJGSU0",
    "kty": "OKP",
    "crv": "Ed25519",
    "alg": "EdDSA",
    "x": "dh2c41edqveCxEzw3OVjtAmdcJPwe4lAg2fJ10rsZk0",
  }
}
```

See [jwt-vc-presentation-profile](https://identity.foundation/jwt-vc-presentation-profile/)

### Generate

```ts
const { 
  did, 
  key: { privateKeyJwk, publicKeyJwk } 
} = await transmute.did.jwk.exportable({
  alg: transmute.did.jws.alg.ES256,
});
const delegate = await transmute.did.jwt.sign({
  issuer: did,
  audience: 'urn:example:audience', // optional.
  protectedHeader: {
    alg: publicKeyJwk.alg,
    iss: did,
    kid: "#0",
    // application/claimSet+json ?
    cty: "vnd.mycompany.myapp.customer+json; version=2.0", 
  },
  claimSet: { "urn:example:claim": true },
  privateKey: privateKeyJwk,
});
```

### Resolve

```ts
// This did:jwk resolver acts as the "allow list" for embedded JWKs.
const trustedResolver = async ({ did }: ResolveParameters) => {
  if (did.startsWith("did:jwk:")) {
    // trust all valid did:jwk, for testing purposes only.
    return transmute.did.jwk.resolve({ did: did as DidJwk });
  }
  return null;
};
const didDocument = await transmute.did.jwt.resolve({
  did: delegate.did,
  // This did:jwk resolver acts as the "allow list" for embedded JWKs.
  resolver: trustedResolver,
});
// didDocument["urn:example:claim"] === true;
```

### Dereference

```ts
const delegate = await transmute.did.jwt.sign({
  issuer: did,
  audience: 'urn:example:audience', // optional.
  protectedHeader: {
    alg: publicKeyJwk.alg,
    iss: did,
    kid: "#0",
    // application/did+json ?
    cty: "vnd.mycompany.myapp.customer+json; version=2.0", 
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
  privateKey: privateKeyJwk,
});

const trustedDidJwkResolver: DidJwkResolver = async ({ did }) => {
  if (did.startsWith("did:jwk:")) {
    return transmute.did.jwk.resolve({ did });
  }
  return null;
};

const trustedDidJwtResolver: DidJwtResolver = async ({ did }) => {
  if (did.startsWith("did:jwt")) {
    return transmute.did.jwt.resolve({
      did,
      // this resolver is used as the "allow list" for embedded JWK.
      resolver: trustedDidJwkResolver,
    });
  }
  return null;
};

const service = await transmute.did.jwt.dereference({
  didUrl: `${delegate.did}#dwn`,
  // dereferencing always requires a trusted resolver.
  resolver: trustedDidJwtResolver,
});
// service.id === "#dwn"
// service.type === "DecentralizedWebNode"
```

## did:web

This method is very 🚧 experimental 🏗️.

### Generate

```ts
 const { did, didDocument, key } = await transmute.did.web.exportable({
  url: "https://id.gs1.transmute.example/01/9506000134352",
  alg: transmute.did.jws.alg.ES256,
  resolver: transmute.did.jwk.resolve,
});
```

### From Private Key

```ts
const { 
  key: {privateKeyJwk} 
} = await transmute.did.jwk.exportable({
  alg: 'ES256',
});
const issuer = await transmute.did.web.fromPrivateKey({
  url: "https://id.gs1.transmute.example/01/9506000134352",
  privateKey: privateKeyJwk,
});
```

### From Dids

```ts
const { 
  did
} = await transmute.did.jwk.exportable({
  alg: 'ES256',
});
const issuer = await transmute.did.web.fromDids({
  url: "https://id.gs1.transmute.example/01/9506000134352",
  dids: [did],
  resolver: transmute.did.jwk.resolve,
});
```

### Resolve

```ts
const { 
  key: { privateKeyJwk } 
} = await transmute.did.jwk.exportable({
  alg: 'ES256',
});
const issuer = await transmute.did.web.fromPrivateKey({
  url: "https://id.gs1.transmute.example/01/9506000134352",
  privateKey: privateKeyJwk,
});
const didDocument = await transmute.did.web.resolve({
  did: issuer.did,
  documentLoader: async (iri: string) => {
    // for test purposes.
    if (iri === "https://id.gs1.transmute.example/01/9506000134352/did.json") {
      return { document: issuer.didDocument };
    }
    throw new Error("Unsupported IRI " + iri);
  },
});
// didDocument.id = "did:web:id.gs1.transmute.example:01:9506000134352"
```

### Dereference

```ts
const { 
  key: { privateKeyJwk } 
} = await transmute.did.jwk.exportable({
  alg: 'ES256',
});
const issuer = await transmute.did.web.fromPrivateKey({
  url: "https://id.gs1.transmute.example/01/9506000134352",
  privateKey: privateKeyJwk,
});
const jws = await transmute.sign({
  payload,
  protectedHeader: {
    alg: privateKey.alg,
  },
  privateKey: privateKeyJwk,
});
const absoluteDidWebUrl = `${issuer.did}#${privateKeyJwk.kid
  ?.split(":")
  .pop()}`;
const vm = await transmute.did.web.dereference({
  didUrl: absoluteDidWebUrl as DidWebUrl,
  resolver: async ({ did }) => {
    // for test purposes.
    if (did === issuer.did) {
      return issuer.didDocument;
    }
    return null;
  },
});
const v = await transmute.verify({
  jws,
  publicKey: (vm as VerificationMethod).publicKeyJwk,
});
```

## Develop

```bash
npm i
npm t
npm run lint
npm run build
```