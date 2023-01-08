import { Did } from "./Did";
import { ParsedDidUrl } from "./ParsedDidUrl";
import { PublicKeyJwk } from "./PublicKeyJwk";

export type VerificationMethod<U extends string> = {
  id: ParsedDidUrl<U>["fragment"];
  type: "JsonWebKey2020";
  controller: Did<U>;
  publicKeyJwk: PublicKeyJwk;
};
