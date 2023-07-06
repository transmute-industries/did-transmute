

import { CompactJsonWebSignature } from "../jose/CompactJsonWebSignature"
import { PrivateKeyJwk } from "../jose/PrivateKeyJwk"
import { PublicKeyJwk } from "../jose/PublicKeyJwk"


export type VcLdJwtHeader = Record<string, unknown> & {
  alg: string
  kid: string
  typ?: 'vc+ld+jwt'
  cty?: 'vc+ld+json'
}

export type VcIssuer = string | Record<string, unknown> & {
  id: string
}

export type VcHolder = string | Record<string, unknown> & {
  id: string
}


export type VcCredentialSubject = Record<string, unknown> & {
  id?: string
}

export type VcType = string | string[]

export type VcCredentialSchema = Record<string, unknown> & {
  id: string
  type: string
}

export type VcCredentialStatus = Record<string, unknown> & {
  id: string
  type: string
}

export type VcProof = Record<string, unknown> & {
  id?: string
  type?: string
}

export type Context = string | string[] | Record<string, unknown>[]

export type VcLd = Record<string, unknown> & {
  '@context': Context
  type: VcType
  issuer: VcIssuer,
  credentialSubject: VcCredentialSubject | VcCredentialSubject[]

  id?: string
  validFrom?: string
  validUntil?: string
  credentialSchema?: VcCredentialSchema | VcCredentialSchema[]
  credentialStatus?: VcCredentialStatus | VcCredentialStatus[]
  proof?: VcProof | VcProof[]
}

export type VpLd = Record<string, unknown> & {
  '@context': Context
  type: VcType
  holder?: VcHolder,
  verifiableCredential?: VcLd | VcLd[]
  proof?: VcProof | VcProof[]
}

export type RequestJwt = {
  header: VcLdJwtHeader
  claimset: VcLd | VpLd
}

export type JwtSigner = {
  sign: (req: RequestJwt) => Promise<string>
}

export type RequestVerifyJwt = {
  jwt: CompactJsonWebSignature
}

export type JwtVerifier = {
  verify: (req: RequestVerifyJwt) => Promise<VcLd>
}
export type RequestVcLdJwt = {
  header: VcLdJwtHeader
  claimset: VcLd
  signer: JwtSigner
}


export type RequestW3CVcLdJwtSigner = {
  privateKey: PrivateKeyJwk
}

export type RequestVerifierFromPublicKey = {
  publicKey: PublicKeyJwk
}


export type RequestVerifierFromResolver = {
  resolver: {
    dereference: (id: string) => Promise<PublicKeyJwk>
  }
}

export type RequestW3CVerifier = RequestVerifierFromPublicKey | RequestVerifierFromResolver