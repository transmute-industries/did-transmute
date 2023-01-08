import { PublicKeyJwk } from "../jose/PublicKeyJwk";
import { PrivateKeyJwk } from "../jose/PrivateKeyJwk";

export type ExportableKey = {
  publicKey: PublicKeyJwk;
  privateKey: PrivateKeyJwk;
};
