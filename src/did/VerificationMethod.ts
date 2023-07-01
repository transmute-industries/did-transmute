import { Did } from "./Did";
import { ParsedDidUrl } from "./ParsedDidUrl";
import { PublicKeyJwk } from "../jose/PublicKeyJwk";

export type AnyVerificationMethodDidUrl = `${string}#${string}`;

export type VerificationMethod<U extends string> = {
  id: ParsedDidUrl<U>["fragment"];
  type: "JsonWebKey";
  controller: Did<U>;
  publicKeyJwk: PublicKeyJwk;
};

export type AnyVerificationMethod = {
  id: ParsedDidUrl<AnyVerificationMethodDidUrl>["fragment"];
  type: "JsonWebKey";
  controller: Did<AnyVerificationMethodDidUrl>;
  publicKeyJwk: PublicKeyJwk;
};
