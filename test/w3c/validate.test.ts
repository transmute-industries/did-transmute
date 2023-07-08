/* eslint-disable @typescript-eslint/no-explicit-any */
import transmute from "../../src";

import yaml from 'js-yaml'
import moment from 'moment'
import { StatusList } from '@transmute/vc-jwt-status-list'


it("validation", async () => {
  const actor = await transmute.did.jwk.exportable({
    alg: "ES256",
  });
  const signer = transmute.w3c.signer({ privateKey: actor.key.privateKey });
  const vc = await signer.sign({
    protectedHeader: {
      kid: actor.did + '#0',
      alg: actor.key.publicKey.alg,
    },
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
  const validator = await transmute.w3c.validator({
    jwt: vc,
    issuer: async (jwt: string) => {
      const id = transmute.w3c.getPublicKeyIdFromToken(jwt);
      const { publicKeyJwk } = await transmute.did.jwk.dereference({
        id,
        documentLoader: transmute.did.jwk.documentLoader,
      });
      // this resolver MUST return application/jwk+json
      return publicKeyJwk
    },
    credentialStatus: async (id: string) => {
      const statusList = await StatusList.create({
        id,
        alg: 'ES256',
        iss: actor.did,
        kid: '#0',
        iat: moment('2021-04-05T14:27:40Z').unix(),
        length: 8,
        purpose: 'suspension',
        signer: {
          sign: async ({ header, claimset }) => {
            return signer.sign({ protectedHeader: header, claimset })
          }
        },
      })
      // this resolver MUST return application/vc+ld+jwt
      return statusList
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
  const validation = await validator.validate(vc)
  expect(validation).toEqual({
    "issuer": {
      "did:web:contoso.example": {
        "verified": true
      }
    },
    "credentialStatus": {
      "https://contoso.example/credentials/status/4#3": {
        "suspension": false
      }
    },
    "credentialSchema": {
      "https://contoso.example/bafybeigdyr...lqabf3oclgtqy55fbzdi": {
        "valid": true
      }
    }
  }
  )

});

