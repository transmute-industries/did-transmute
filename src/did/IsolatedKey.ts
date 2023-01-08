import { PublicKeyJwk } from "../jose/PublicKeyJwk";

export type IsolatedKey = {
  publicKeyJwk: PublicKeyJwk; // make "publicKey"
  privateKey: CryptoKey;
};
