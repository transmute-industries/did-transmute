/* eslint-disable @typescript-eslint/no-explicit-any */
import transmute from "../../src";
import { decodeProtectedHeader } from 'jose'
import yaml from 'js-yaml'
import moment from 'moment'

it("validation", async () => {
  const actor = await transmute.did.jwk.exportable({
    alg: "ES256",
  });
  const issuer = await transmute.w3c.vc.issuer({ signer: await transmute.w3c.controller.key.attached.signer({ privateKey: actor.key.privateKey as any }) });
  const protectedHeader = {
    kid: actor.did + '#0',
    alg: actor.key.publicKey.alg,
  }
  const vc = await issuer.issue({
    protectedHeader,
    claimset: {
      "@context": [
        "https://www.w3.org/ns/credentials/v2",
        "https://www.w3.org/ns/credentials/examples/v2"
      ],
      "id": "https://contoso.example/credentials/35327255",
      "type": ["VerifiableCredential", "KYCExample"],
      "issuer": "did:web:contoso.example",
      "validFrom": "2019-05-25T03:10:16.992Z",
      "validUntil": "2027-05-25T03:10:16.992Z",
      "credentialStatus": {
        "id": "https://contoso.example/credentials/status/4#3",
        "type": "StatusList2021Entry",
        "statusPurpose": "suspension",
        "statusListIndex": "3",
        "statusListCredential": "https://contoso.example/credentials/status/4"
      },
      "credentialSchema": {
        "id": "https://contoso.example/bafybeigdyr...lqabf3oclgtqy55fbzdi",
        "type": "JsonSchema"
      },
      "credentialSubject": {
        "id": "did:example:1231588",
        "type": "Person"
      }
    },
  });

  const validator = await transmute.w3c.vc.validator({
    vc,
    issuer: async (jwt: string) => {
      const { kid } = decodeProtectedHeader(jwt) as any
      const { publicKeyJwk } = await transmute.did.jwk.dereference({
        id: kid,
        documentLoader: transmute.did.jwk.documentLoader,
      });
      // this resolver MUST return application/jwk+json
      return publicKeyJwk

    },
    credentialStatus: async (id: string) => {
      const statusList = await transmute.w3c.vc.StatusList.create({
        id,
        length: 8,
        purpose: 'suspension',
      })
      statusList.issuer = actor.did
      statusList.validFrom = moment().toISOString()
      // this resolver MUST return application/vc+ld+jwt
      const jwt = await issuer.issue({
        protectedHeader,
        claimset: statusList
      })
      return jwt
    },
    credentialSchema: async (id: string) => {
      const loaded = yaml.load(`
$id: ${id}
title: W3C Verifiable Credential 
description: A JSON-LD Object of RDF type https://www.w3.org/2018/credentials#VerifiableCredential.
type: object
properties:
  '@context':
    type: array
    readOnly: true
    default:
      - https://www.w3.org/ns/credentials/v2
    items:
      - type: string
        const: https://www.w3.org/ns/credentials/v2
    additionalItems:
      type: string
      enum:
        - https://www.w3.org/ns/credentials/examples/v2
      `)
      // this resolver MUST return application/schema+json
      return JSON.parse(JSON.stringify(loaded))
    }
  })
  const verifier = await transmute.w3c.vc.verifier({
    issuer: async (jwt: string) => {
      const { kid } = decodeProtectedHeader(jwt) as any
      const { publicKeyJwk } = await transmute.did.jwk.dereference({
        id: kid,
        documentLoader: transmute.did.jwk.documentLoader,
      });
      // this resolver MUST return application/jwk+json
      return publicKeyJwk
    }
  })
  const verified = await verifier.verify(vc)
  const validation = await validator.validate(verified)
  expect(validation.issuer).toEqual(actor.key.publicKey)
  expect((validation.credentialSchema?.valid)).toBe(true)
  expect((validation.credentialSchema as any)['https://contoso.example/bafybeigdyr...lqabf3oclgtqy55fbzdi']).toBeDefined()
  expect((validation.credentialStatus?.valid)).toBe(true)
  expect((validation.credentialStatus as any)['https://contoso.example/credentials/status/4#3'].suspension).toBe(false)
});

