
import { StatusList } from '@transmute/vc-jwt-status-list'

import { verifyWithKey } from "../jose"

import Ajv from 'ajv'

import { RequestValidator } from '../types/W3C'

const ajv = new Ajv({
  strict: false,
})

// This is ugly because my deps are ugly...
export const validator = async ({ issuer, credentialStatus, credentialSchema }: RequestValidator) => {
  // TODO: decode and precompile / cache anything we can before returning the validator

  const validate = async (jwt: any) => {
    const issuerPublicKey = await issuer(jwt)
    const { payload } = await verifyWithKey({ jws: jwt, publicKey: issuerPublicKey })
    const claimset = JSON.parse(payload.toString())
    const statusLists: any = {}
    if (claimset.credentialStatus) {
      const credentialStatuses = Array.isArray(claimset.credentialStatus) ? claimset.credentialStatus : [claimset.credentialStatus]
      for (const cs of credentialStatuses) {
        const statusValue = await StatusList.checkStatus({
          id: cs.statusListCredential,
          purpose: cs.statusPurpose,
          position: parseInt(cs.statusListIndex, 10),
          resolver: {
            resolve: credentialStatus
          },
          verifier: {
            verify: async ({ jwt }: any) => {
              const statusListIssuerKey = await issuer(jwt)
              const { protectedHeader, payload } = await verifyWithKey({ jws: jwt, publicKey: statusListIssuerKey })
              const claimset = JSON.parse(payload.toString())
              return { protectedHeader, payload: claimset } as any
            },
          }
        })
        statusLists[cs.id] = { [cs.statusPurpose]: statusValue }
      }
    }
    const schemas: any = {}
    if (claimset.credentialSchema) {
      const credentialSchemas = Array.isArray(claimset.credentialSchema) ? claimset.credentialSchema : [claimset.credentialSchema]
      for (const cs of credentialSchemas) {
        const schema = await await credentialSchema(cs.id)
        const validate = ajv.compile(schema)
        schemas[cs.id] = {
          valid: validate(claimset)
        }
      }
    }
    const issuerId = claimset.issuer.id || claimset.issuer
    const validation = { issuer: { [issuerId]: { verified: true } }, credentialStatus: statusLists, credentialSchema: schemas }
    return validation
  }
  return { validate }

}