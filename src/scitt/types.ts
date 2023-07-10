// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PublicKeyJwk = any;
export type PrivateKeyJwk = any;

export type ResolveIssuerPublicKey = (message: Uint8Array) => Promise<PublicKeyJwk>

export type RequestCoseSinger = {
  privateKey: PrivateKeyJwk
}

export type RequestCoseVerifier = {
  issuer: ResolveIssuerPublicKey
}