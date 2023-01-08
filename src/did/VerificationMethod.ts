import { Did } from "./Did";
import { ParsedDidUrl } from "./ParsedDidUrl";
import { PublicKeyJwk } from "../jose/PublicKeyJwk";
import { AnyDid } from "./Did";

export type AnyVerificationMethodDidUrl = `${AnyDid}#${string}`;

export type VerificationMethod<U extends string> = {
  id: ParsedDidUrl<U>["fragment"];
  type: "JsonWebKey2020";
  controller: Did<U>;
  publicKeyJwk: PublicKeyJwk;
};

export type AnyVerificationMethod = {
  id: ParsedDidUrl<AnyVerificationMethodDidUrl>["fragment"];
  type: "JsonWebKey2020";
  controller: Did<AnyVerificationMethodDidUrl>;
  publicKeyJwk: PublicKeyJwk;
};
