import * as jose from 'jose'

const getKidFromJwt = (jwt: string) => {
  const decoded = jose.decodeProtectedHeader(jwt)
  return decoded.kid
}

export default getKidFromJwt