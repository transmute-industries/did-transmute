import { PublicKeyJwk } from "../jose/PublicKeyJwk";
import { PrivateKeyJwk } from "../jose/PrivateKeyJwk";

export type ExportableKey = {
  publicKeyJwk: PublicKeyJwk; // fix me publicKey
  privateKeyJwk: PrivateKeyJwk; // fix me privateKey
};
