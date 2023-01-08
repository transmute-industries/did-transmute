import { parseDidUrl } from "./parseDidUrl";

const findInBuckets = (didDocument: any, didUrl: any) => {
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

export const dereferenceWithinDocument = ({ id, document }: any): any => {
  if (!document) {
    throw new Error("Document is null");
  }
  const { path, query, fragment } = parseDidUrl(id);
  // derefernce of a naked did is equivalent to resolution?
  if (path === "" && query === "" && fragment === "") {
    return document;
  }
  const item = findInBuckets(document, id);
  return item;
};
