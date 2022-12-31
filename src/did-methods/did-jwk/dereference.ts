import { DidUrl } from "../../types/DidUrl";
import { VerificationMethod } from "../../types/VerificationMethod";

import { resolve } from "./resolve";
import { parseDidUrl } from "../../util/parseDidUrl";
import { DidDocument } from "../../types";

export const dereference = (
  didUrl: DidUrl
): DidDocument | VerificationMethod | null => {
  const { did, path, query, fragment } = parseDidUrl(didUrl);
  const didDocument = resolve(did);
  if (!didDocument) {
    return null;
  }
  // derefernce of a naked did is equivalent to resolution?
  if (path === "" && query === "" && fragment === "") {
    return didDocument;
  }
  if (
    !didDocument.verificationMethod ||
    didDocument.verificationMethod.length === 0
  ) {
    return null;
  }
  const vm = didDocument.verificationMethod.find((vm) => {
    return vm.id === didUrl || vm.id === `#${fragment}`;
  });
  if (!vm) {
    return null;
  }
  return vm;
};
