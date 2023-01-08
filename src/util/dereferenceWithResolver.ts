import { DidDocument, DidUrl } from "../types";
import { VerificationMethod } from "../types/VerificationMethod";
import { parseDidUrl } from "./parseDidUrl";

const findInBuckets = (didDocument: DidDocument, didUrl: DidUrl) => {
  const { fragment } = parseDidUrl(didUrl);
  const bucket = [
    ...(didDocument.verificationMethod || []),
    ...(didDocument.service || []),
  ];

  const item = bucket.find((vm) => {
    return vm.id === didUrl || vm.id === `#${fragment}`;
  });
  return item ? item : null;
};

// refactor
export const dereferenceWithResolver = async ({
  didUrl,
  resolver,
}: any): Promise<DidDocument | VerificationMethod | null> => {
  const { did, path, query, fragment } = parseDidUrl(didUrl);
  const didDocument = await resolver({ did });

  if (!didDocument) {
    return null;
  }
  // derefernce of a naked did is equivalent to resolution?
  if (path === "" && query === "" && fragment === "") {
    return didDocument;
  }

  const item = findInBuckets(didDocument, didUrl);
  return item;
};
