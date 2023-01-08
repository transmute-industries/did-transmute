import { Did } from "./Did";
import { IsolatedKey } from "./IsolatedKey";

export type IsolatedActor<U extends string> = {
  did: Did<U>;
  key: IsolatedKey;
};
