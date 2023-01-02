import { DidJwk, DidJwkResolver, DidDocument } from "../../types";
import { endpointToDid } from "./endpointToDid";
import { formatDidDocument } from "../../util/formatDidDocument";

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
  };
  await Promise.all(
    dids.map(async (did) => {
      const delegateDocument = (await resolver({ did })) as DidDocument;
      // accumulate verification methods
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
  // TODO: set relationships?
  return formatDidDocument(didDocument);
};
