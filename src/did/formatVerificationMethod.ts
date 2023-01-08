import { AnyVerificationMethod } from "./VerificationMethod";
export const formatVerificationMethod = (
  vm: AnyVerificationMethod
): AnyVerificationMethod => {
  const formatted = {
    id: vm.id,
    type: vm.type,
    controller: vm.controller,
    publicKeyJwk: vm.publicKeyJwk,
  };
  return JSON.parse(JSON.stringify(formatted));
};
