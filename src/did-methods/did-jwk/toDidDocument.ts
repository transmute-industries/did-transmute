import { JsonWebKey } from "./types/JsonWebKey";
import { toDid } from "./toDid";
import { DidDocument, DidUrl, VerificationMethod } from "./types/DidDocument";
import { getPublicKeyJwk } from "./getPublicKeyJwk";

import { signatureAlgorithms } from "../did-jws/alg";
import { keyAgreementAlgorithms } from "../did-jwe/alg";

import {
  signatureVerificationRelationships,
  encryptionVerificationRelationships,
} from "./method";
import { SignatureAlgorithm } from "../did-jws/types/Algorithm";
import { KeyAgreementAlgorithm } from "../did-jwe/types/Algorithm";

const formatVerificationMethod = (
  vm: VerificationMethod
): VerificationMethod => {
  return JSON.parse(
    JSON.stringify({
      id: vm.id,
      type: vm.type,
      controller: vm.controller,
      publicKeyJwk: vm.publicKeyJwk,
    })
  );
};

const formatDidDocument = (didDocument: DidDocument): DidDocument => {
  return JSON.parse(
    JSON.stringify({
      "@context": didDocument["@context"],
      id: didDocument.id,
      verificationMethod: didDocument.verificationMethod.map(
        formatVerificationMethod
      ),
      authentication: didDocument.authentication,
      assertionMethod: didDocument.assertionMethod,
      capabilityInvocation: didDocument.capabilityInvocation,
      capabilityDelegation: didDocument.capabilityDelegation,
      keyAgreement: didDocument.keyAgreement,
    })
  );
};

export const toDidDocument = (jwk: JsonWebKey) => {
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
