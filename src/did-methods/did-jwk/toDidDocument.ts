import { toDid } from "./toDid";

import { DidUrl } from "../../types/DidUrl";
import { VerificationMethod } from "../../types/VerificationMethod";
import { DidDocument } from "../../types/DidDocument";
import { getPublicKeyJwk } from "./getPublicKeyJwk";

import { signatureAlgorithms } from "../did-jws/alg";
import { keyAgreementAlgorithms } from "../did-jwe/alg";

import {
  signatureVerificationRelationships,
  encryptionVerificationRelationships,
} from "./method";

import { AsymmetricJsonWebKey } from "../../types/AsymmetricJsonWebKey";
import { SignatureAlgorithm } from "../../types/SignatureAlgorithm";
import { KeyAgreementAlgorithm } from "../../types/KeyAgreementAlgorithm";

import { formatDidDocument } from "../../util/formatDidDocument";

export const toDidDocument = (jwk: AsymmetricJsonWebKey) => {
  const publicKeyJwk = getPublicKeyJwk(jwk);
  const did = toDid(publicKeyJwk);
  const vm: VerificationMethod = {
    id: "#0" as DidUrl,
    type: "JsonWebKey2020",
    controller: did,
    publicKeyJwk,
  };
  const didDocument: DidDocument = {
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
