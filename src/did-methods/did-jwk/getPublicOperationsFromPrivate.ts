import { KeyOperation } from "../../types/KeyOperation";

import * as ko from "./keyOperations";

export const getPublicOperationsFromPrivate = (
  keyOperations: KeyOperation[]
) => {
  if (keyOperations.includes(ko.sign)) {
    return [ko.verify];
  }
  // public keys that can verify can also be encrypted to.
  if (keyOperations.includes(ko.verify)) {
    return [ko.encrypt];
  }
  return keyOperations;
};
