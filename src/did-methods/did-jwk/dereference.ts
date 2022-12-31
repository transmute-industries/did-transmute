import { DidUrl } from "../../types/DidUrl";
import { VerificationMethod } from "../../types/VerificationMethod";

import { resolve } from "./resolve";
import { parseDidUrl } from "../../util/parseDidUrl";

export const dereference = (
  didUrl: DidUrl | string
): VerificationMethod | null => {
  const { did, fragment } = parseDidUrl(didUrl);
  const didDocument = resolve(did);
  const [vm] = didDocument.verificationMethod || [];
  if (!vm) {
    return null;
  }
  if (vm.id === didUrl || vm.id === `#${fragment}`) {
    return vm;
  }
  return null;
};
