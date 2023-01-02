import { Algorithm } from "../../../types/Algorithm";
import { generate } from "./generate";

import { ExportableDidJwkActor } from "../../../types";

export type Exportable = {
  alg: Algorithm;
};

export const exportable = async ({
  alg,
}: Exportable): Promise<ExportableDidJwkActor> => {
  const actor = await generate({ alg, extractable: true });
  return actor as ExportableDidJwkActor;
};
