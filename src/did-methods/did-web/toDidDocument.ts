import {
  DidJwk,
  DidJwkResolver,
  DidDocument,
  SignatureRelationships,
  EncryptionRelationships,
} from "../../types";
import { endpointToDid } from "./endpointToDid";
import { formatDidDocument } from "../../util/formatDidDocument";

import {
  signatureVerificationRelationships,
  encryptionVerificationRelationships,
} from "../did-jwk/method";

const mergeDocuments = (
  propertName:
    | "verificationMethod"
    | SignatureRelationships
    | EncryptionRelationships,
  didDocumentLeft: DidDocument,
  didDocumentRight: DidDocument
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (didDocumentLeft as any)[propertName] = [
    ...(didDocumentLeft[propertName] || []),
    ...(didDocumentRight[propertName] || []),
  ];
};

export const toDidDocument = async (
  url: string,
  dids: DidJwk[],
  resolver: DidJwkResolver
): Promise<DidDocument> => {
  const controller = endpointToDid(url);
  const didDocument: DidDocument = {
    "@context": [
      "https://www.w3.org/ns/did/v1",
      { "@vocab": "https://www.iana.org/assignments/jose#" },
    ],
    id: controller,
    verificationMethod: [],
    authentication: [],
    assertionMethod: [],
    capabilityInvocation: [],
    capabilityDelegation: [],
    keyAgreement: [],
  };
  await Promise.all(
    dids.map(async (did) => {
      const delegateDocument = (await resolver({ did })) as DidDocument;
      // verification material
      mergeDocuments("verificationMethod", didDocument, delegateDocument);
      // signature relationships
      signatureVerificationRelationships.forEach((vr) => {
        mergeDocuments(vr, didDocument, delegateDocument);
      });
      // key agreement relationships
      encryptionVerificationRelationships.forEach((vr) => {
        mergeDocuments(vr, didDocument, delegateDocument);
      });
    })
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  didDocument.verificationMethod?.forEach((vm: any) => {
    vm.id = `#${vm.publicKeyJwk.kid.split(":").pop()}`;
    vm.controller = controller;
  });
  return formatDidDocument(didDocument);
};
