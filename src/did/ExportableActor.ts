import { Did } from "./Did";

import { ExportableKey } from "./ExportableKey";

export type ExportableActor<U extends string> = {
  did: Did<U>;
  key: ExportableKey;
};
