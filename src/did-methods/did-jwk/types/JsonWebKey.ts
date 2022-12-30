import { KeyOperation } from "./KeyOperation";

import { SignatureAlgorithm } from "../../did-jws/types/Algorithm";
import { KeyAgreementAlgorithm } from "../../did-jwe/types/Algorithm";

export type PublicKeyJwk = {
  kid: string;
  kty: string;
  crv: string;
  x: string;
  y: string;
  alg: SignatureAlgorithm | KeyAgreementAlgorithm;
  key_ops: KeyOperation[];
  [x: string]: unknown;
};

export type PrivateKeyJwk = PublicKeyJwk & {
  d: string;
  p: string;
  q: string;
  dp: string;
  dq: string;
  qi: string;
};

export type JsonWebKey = PublicKeyJwk | PrivateKeyJwk;

export type JsonWebKey2020 = {
  publicKeyJwk: PublicKeyJwk;
  privateKeyJwk: PrivateKeyJwk;
};
