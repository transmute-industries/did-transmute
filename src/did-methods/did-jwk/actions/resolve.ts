import { resolve as r } from "../resolve";
import { DidUrl } from "../types/DidDocument";

export type Resolve = {
  didUrl: DidUrl | string;
};

export const resolve = ({ didUrl }: Resolve) => {
  return r(didUrl);
};
