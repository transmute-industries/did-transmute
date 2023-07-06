import cose, { PublicKeyJwk } from "@transmute/cose";


import { RequestVerifierFromResolver } from "../types/W3C";
import { DetachedSignature } from "@transmute/cose/dist/types/DetachedSignature";

export const verifier = ({ resolver }: RequestVerifierFromResolver) => {
  return {
    verify: async ({ payload, signature }: DetachedSignature): Promise<boolean> => {
      try {
        const kid = cose.getKid(signature)
        if (!kid) {
          throw new Error('No kid found, unable to locate key material')
        }
        const publicKey = await resolver.dereference(kid)
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