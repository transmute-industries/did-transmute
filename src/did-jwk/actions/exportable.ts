import { ExportableActor } from "../../types";
import { Algorithm } from "../../jose/Algorithm";
import { generate } from "./generate";
import { DidJwk } from "../types";

export type Exportable = {
  alg: Algorithm;
};

export const exportable = async ({
  alg,
}: Exportable): Promise<ExportableActor<DidJwk>> => {
  const actor = await generate({ alg, extractable: true });
  return actor as ExportableActor<DidJwk>;
};
