import * as jose from 'jose'

export const getPublicKeyIdFromToken = (jwt: string) => {
  const { iss, kid } = jose.decodeProtectedHeader(jwt) as any
  const id = iss && kid ? `${iss}${kid}` : kid
  return id;
}
