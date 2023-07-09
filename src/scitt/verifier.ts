import cose, { PublicKeyJwk } from "@transmute/cose";

import { RequestVerifier } from "../types/W3C";
import { DetachedSignature } from "@transmute/cose/dist/types/DetachedSignature";

export const verifier = ({ issuer }: RequestVerifier) => {
  return {
    verify: async ({ payload, signature }: DetachedSignature): Promise<boolean> => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const kid = cose.getKid(signature) as any
        if (!kid) {
          throw new Error('No kid found, unable to locate key material')
        }
        const publicKey = await issuer(kid)
        const verifier = await cose.detached.verifier({
          publicKeyJwk: publicKey as PublicKeyJwk
        })
        return verifier.verify({ payload, signature })
      } catch (e) {
        console.log(e)
        return false
      }
    }
  }
}