import { dereference as d } from "../dereference";
import { DidUrl } from "../types/DidDocument";

export type Dereference = {
  didUrl: DidUrl | string;
};

export const dereference = ({ didUrl }: Dereference) => {
  return d(didUrl);
};
