import { signWithKey } from '../jose/signWithKey'

import { RequestIssuer, RequestJwt } from '../types/W3C'

export const signer = ({ privateKey }: RequestIssuer) => {
  return {
    sign: ({ protectedHeader, claimset }: RequestJwt) => {
      return signWithKey({
        privateKey: privateKey,
        protectedHeader: protectedHeader,
        payload: new TextEncoder().encode(JSON.stringify(claimset)),
      });
    }
  }
}