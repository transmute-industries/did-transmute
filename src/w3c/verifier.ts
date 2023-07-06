import { verifyWithKey } from '../jose';

import { RequestW3CVerifier, RequestVerifyJwt, VcLd, RequestVerifierFromPublicKey, RequestVerifierFromResolver } from '../types/W3C'


import getKidFromJwt from '../jose/getKidFromJwt'

export const verifier = (req: RequestW3CVerifier) => {
  return {
    verify: async ({ jwt }: RequestVerifyJwt) => {
      let publicKey;
      if ((req as RequestVerifierFromPublicKey).publicKey) {
        publicKey = (req as RequestVerifierFromPublicKey).publicKey
      }
      if ((req as RequestVerifierFromResolver).resolver) {
        const kid = getKidFromJwt(jwt)
        if (!kid) {
          throw new Error('No kid found, unable to locate key material')
        }
        publicKey = await (req as RequestVerifierFromResolver).resolver.dereference(kid)
      }
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