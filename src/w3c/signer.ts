import { signWithKey } from '../jose/signWithKey'

import { RequestW3CVcLdJwtSigner, RequestJwt } from '../types/W3C'

export const signer = ({ privateKey }: RequestW3CVcLdJwtSigner) => {
  return {
    sign: ({ header, claimset }: RequestJwt) => {
      return signWithKey({
        privateKey: privateKey,
        protectedHeader: header,
        payload: new TextEncoder().encode(JSON.stringify(claimset)),
      });
    }
  }
}