/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// import {
//   DidDocument,
//   DidWebDelegateType,
//   DidWebDelegateResolver,
// } from "./types";

import { endpointToDid } from "./endpointToDid";
import { formatDidDocument } from "../did/formatDidDocument";

const extractNonRelationships = (didDocument: any) => {
  const {
    verificationMethod,
    authentication,
    assertionMethod,
    capabilityInvocation,
    capabilityDelegation,
    keyAgreement,
    ...rest
  } = didDocument;
  return rest;
};

export const toDidDocument = async (
  url: string,
  dids: any[],
  documentLoader: any
): Promise<any> => {
  const controller = endpointToDid(url);
  let didDocument: any = {
    "@context": [
      "https://www.w3.org/ns/did/v1",
      { "@vocab": "https://www.iana.org/assignments/jose#" },
    ],
  };
  await Promise.all(
    dids.map(async (did) => {
      const { document } = await documentLoader(did);
      // merging must cover all properties.
      // accumulate verification methods
      const latestProps = extractNonRelationships(document);
      didDocument = {
        ...didDocument,
        ...latestProps,
      };
      didDocument.verificationMethod = [
        ...(didDocument.verificationMethod || []),
        ...(document.verificationMethod || []),
      ];
    })
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  didDocument.verificationMethod?.forEach((vm: any) => {
    vm.id = `#${vm.publicKeyJwk.kid.split(":").pop()}`;
    vm.controller = controller;
  });
  didDocument.id = controller;
  // TODO: set relationships?
  return formatDidDocument(didDocument);
};
