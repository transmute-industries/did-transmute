import { VerificationMethod } from "../types/VerificationMethod";

export const formatVerificationMethod = (
  vm: VerificationMethod
): VerificationMethod => {
  const formatted = {
    id: vm.id,
    type: vm.type,
    controller: vm.controller,
    publicKeyJwk: vm.publicKeyJwk,
  };
  return JSON.parse(JSON.stringify(formatted));
};
