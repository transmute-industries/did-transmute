/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  DidDocument,
  DidWebDelegateType,
  DidWebDelegateResolver,
} from "../../types";
import { endpointToDid } from "./endpointToDid";
import { formatDidDocument } from "../../util/formatDidDocument";

const extractNonrelationships = (didDocument: any) => {
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
  dids: DidWebDelegateType[],
  resolver: DidWebDelegateResolver
): Promise<DidDocument> => {
  const controller = endpointToDid(url);
  let didDocument: any = {
    "@context": [
      "https://www.w3.org/ns/did/v1",
      { "@vocab": "https://www.iana.org/assignments/jose#" },
    ],
  };
  await Promise.all(
    dids.map(async (did) => {
      const delegateDocument = (await resolver({
        did,
        resolver,
      })) as DidDocument;
      // merging must cover all properties.
      // accumulate verification methods
      const latestProps = extractNonrelationships(delegateDocument);
      didDocument = {
        ...didDocument,
        ...latestProps,
      };
      didDocument.verificationMethod = [
        ...(didDocument.verificationMethod || []),
        ...(delegateDocument.verificationMethod || []),
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
