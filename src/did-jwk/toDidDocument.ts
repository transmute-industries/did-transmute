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
export const toDidDocument = (jwk: AsymmetricJsonWebKey) => {
  const publicKeyJwk = getPublicKeyJwk(jwk);
  const did = toDid(publicKeyJwk);
  const vm: any = {
    id: "#0",
    type: "JsonWebKey2020",
    controller: did,
    publicKeyJwk,
  };
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
