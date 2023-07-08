import { verifyWithKey } from '../jose';

import { RequestVerifier, RequestVerifyJwt, VcLd } from '../types/W3C'

export const verifier = ({ issuer }: RequestVerifier) => {
  return {
    verify: async ({ jwt }: RequestVerifyJwt) => {
      const publicKey = await issuer(jwt)
      if (!publicKey) {
        throw new Error('No public key available to verify')
      }
      const verified = await verifyWithKey({
        publicKey: publicKey,
        jws: jwt
      })
      return {
        protectedHeader: verified.protectedHeader,
        claimset: JSON.parse(new TextDecoder().decode(verified.payload)) as VcLd
      }
    }
  }
}