import { DidUrl, VerificationMethod } from "./types/DidDocument";
import { resolve } from "./resolve";
import { parseDidUrl } from "./parseDidUrl";

export const dereference = (
  didUrl: DidUrl | string
): VerificationMethod | null => {
  const { did, fragment } = parseDidUrl(didUrl);
  const didDocument = resolve(did);
  const [vm] = didDocument.verificationMethod;
  if (vm.id === `#${fragment}`) {
    return vm;
  }
  return null;
};
