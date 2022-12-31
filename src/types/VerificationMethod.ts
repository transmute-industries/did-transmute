import { DidUrl } from "./DidUrl";
import { Did } from "./Did";
import { PublicKeyJwk } from "./PublicKeyJwk";

export type VerificationMethod = {
  id: DidUrl;
  type: "JsonWebKey2020";
  controller: Did;
  publicKeyJwk: PublicKeyJwk;
};
