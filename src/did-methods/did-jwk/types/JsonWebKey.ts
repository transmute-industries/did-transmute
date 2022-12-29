import { KeyOperation } from "./KeyOperation";

import { SignatureAlgorithm } from "../../did-jws/types/Algorithm";
import { KeyAgreementAlgorithm } from "../../did-jwe/types/Algorithm";

export type PublicKeyJwk = {
  kid: string;
  alg: SignatureAlgorithm | KeyAgreementAlgorithm;
  key_ops: KeyOperation[];
  [x: string]: unknown;
};

export type PrivateKeyJwk = PublicKeyJwk & {
  d: string;
};

export type JsonWebKey = PublicKeyJwk | PrivateKeyJwk;

export type JsonWebKey2020 = {
  publicKeyJwk: PublicKeyJwk;
  privateKeyJwk: PrivateKeyJwk;
};
