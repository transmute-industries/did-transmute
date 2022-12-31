import { resolve as r } from "../resolve";
import { Did } from "../../../types/Did";

export type Resolve = {
  did: Did;
};

export const resolve = ({ did }: Resolve) => {
  return r(did);
};
