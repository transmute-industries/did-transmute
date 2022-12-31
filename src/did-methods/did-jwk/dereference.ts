import { DidUrl } from "../../types/DidUrl";
import { VerificationMethod } from "../../types/VerificationMethod";

import { resolve } from "./resolve";
import { parseDidUrl } from "../../util/parseDidUrl";

export const dereference = (didUrl: DidUrl): VerificationMethod | null => {
  const { did, fragment } = parseDidUrl(didUrl);
  const didDocument = resolve(did);
  if (!didDocument) {
    return null;
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
