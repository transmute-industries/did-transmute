


import { CompactJsonWebSignature } from "../jose/CompactJsonWebSignature"
import { PrivateKeyJwk } from "../jose/PrivateKeyJwk"
import { PublicKeyJwk } from "../jose/PublicKeyJwk"

import { JWTHeaderParameters } from "jose"

export type VcLdJwtHeader = JWTHeaderParameters | Record<string, unknown> & {
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
  protectedHeader: VcLdJwtHeader
  claimset: VcLd | VpLd
}

export type JwtSigner = {
  sign: ({ protectedHeader, claimset }: RequestJwt) => Promise<string>
}

export type RequestVerifyJwt = {
  jwt: CompactJsonWebSignature
}

export type JwtVerifier = {
  verify: ({ jwt }: RequestVerifyJwt) => Promise<VcLd>
}
export type RequestVcLdJwt = {
  protectedHeader: VcLdJwtHeader
  claimset: VcLd
  signer: JwtSigner
}


export type RequestIssuer = {
  privateKey: PrivateKeyJwk
}
export type RequestVerifier = {
  issuer: (id: string) => Promise<PublicKeyJwk>
}

export type JsonSchema = Record<string, unknown>

export type RequestValidator = RequestVerifier & {
  credentialStatus: (id: string) => Promise<CompactJsonWebSignature>
  credentialSchema: (id: string) => Promise<JsonSchema>
}



