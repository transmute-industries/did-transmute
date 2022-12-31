import { PublicKeyJwk } from "./PublicKeyJwk";
import { PrivateKeyJwk } from "./PrivateKeyJwk";

export type ExportableKey = {
  publicKeyJwk: PublicKeyJwk;
  privateKeyJwk: PrivateKeyJwk;
};
