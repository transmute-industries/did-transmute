export const formatVerificationMethod = (vm: any): any => {
  const formatted = {
    id: vm.id,
    type: vm.type,
    controller: vm.controller,
    publicKeyJwk: vm.publicKeyJwk,
  };
  return JSON.parse(JSON.stringify(formatted));
};
