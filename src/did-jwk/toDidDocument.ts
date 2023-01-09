import { toDid } from "./toDid";
import { getPublicKeyJwk } from "./getPublicKeyJwk";
import { signatureAlgorithms, keyAgreementAlgorithms } from "../jose/alg";
import {
  signatureVerificationRelationships,
  encryptionVerificationRelationships,
} from "./method";
import { AsymmetricJsonWebKey } from "../jose/AsymmetricJsonWebKey";
import { SignatureAlgorithm } from "../jose/SignatureAlgorithm";
import { KeyAgreementAlgorithm } from "../jose/KeyAgreementAlgorithm";
import { formatDidDocument } from "../did/formatDidDocument";
import {
  VerificationMethod,
  // AnyVerificationMethodDidUrl, delete me
} from "../did/VerificationMethod";
import { DidJwk } from "./types";
import { ParsedDidUrl } from "../did/ParsedDidUrl";

export const toDidDocument = (jwk: AsymmetricJsonWebKey) => {
  const publicKeyJwk = getPublicKeyJwk(jwk);
  const did = toDid(publicKeyJwk);
  const vm: VerificationMethod<DidJwk> = {
    id: "#0" as ParsedDidUrl<DidJwk>["fragment"],
    type: "JsonWebKey2020",
    controller: did,
    publicKeyJwk,
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const didDocument: any = {
    "@context": [
      "https://www.w3.org/ns/did/v1",
      { "@vocab": "https://www.iana.org/assignments/jose#" },
    ],
    id: did,
    verificationMethod: [vm],
    authentication: [],
    assertionMethod: [],
    capabilityInvocation: [],
    capabilityDelegation: [],
    keyAgreement: [],
  };
  if (signatureAlgorithms.includes(publicKeyJwk.alg as SignatureAlgorithm)) {
    signatureVerificationRelationships.forEach((vr) => {
      didDocument[vr] = [vm.id];
    });
  }
  if (
    keyAgreementAlgorithms.includes(publicKeyJwk.alg as KeyAgreementAlgorithm)
  ) {
    encryptionVerificationRelationships.forEach((vr) => {
      didDocument[vr] = [vm.id];
    });
  }
  return formatDidDocument(didDocument);
};
