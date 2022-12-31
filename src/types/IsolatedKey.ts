import { PublicKeyJwk } from "./PublicKeyJwk";

export type IsolatedKey = {
  publicKeyJwk: PublicKeyJwk; // fixme
  privateKey: CryptoKey;
};
