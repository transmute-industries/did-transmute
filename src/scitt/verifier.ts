import cose, { PublicKeyJwk } from "@transmute/cose";

import { DetachedSignature } from "@transmute/cose/dist/types/DetachedSignature";

import { RequestCoseVerifier } from './types'

export const verifier = ({ issuer }: RequestCoseVerifier) => {
  return {
    verify: async ({ payload, signature }: DetachedSignature): Promise<boolean> => {
      try {
        const publicKey = await issuer(signature)
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