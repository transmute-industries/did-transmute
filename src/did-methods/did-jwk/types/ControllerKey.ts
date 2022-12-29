import { JsonWebKey2020, PublicKeyJwk } from "./JsonWebKey";

export type ExtractableControllerKey = JsonWebKey2020;

export type UnExtractableControllerKey = {
  publicKeyJwk: PublicKeyJwk;
  privateKey: CryptoKey;
};

export type ControllerKey =
  | ExtractableControllerKey
  | UnExtractableControllerKey;
