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

This is accomplished by defining resolution and derefernecing for the DID URLs under the "projection method".

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
const { did } = await transmute.did.jwk.exportable({
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
const { key: { privateKeyJwk, publicKeyJwk } } = await transmute.did.jwk.exportable({
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
const { key: { privateKeyJwk, publicKeyJwk } } = await transmute.did.jwk.exportable({
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

## Develop

```bash
npm i
npm t
npm run lint
npm run build
```