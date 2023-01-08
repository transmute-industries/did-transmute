import { PublicKeyJwk } from "../jose/PublicKeyJwk";

export type IsolatedKey = {
  publicKey: PublicKeyJwk;
  privateKey: CryptoKey;
};
