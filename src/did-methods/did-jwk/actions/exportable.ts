import { ExportableActor } from "../../../types";
import { Algorithm } from "../../../types/Algorithm";
import { generate } from "./generate";

export type Exportable = {
  alg: Algorithm;
};

export const exportable = async ({
  alg,
}: Exportable): Promise<ExportableActor> => {
  const actor = await generate({ alg, extractable: true });
  return actor as ExportableActor;
};
