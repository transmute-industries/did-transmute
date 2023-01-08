import { IsolatedActor } from "../../types";
import { Algorithm } from "../../types/Algorithm";
import { generate } from "./generate";

export type Isolated = {
  alg: Algorithm;
};

export const isolated = async ({ alg }: Isolated): Promise<IsolatedActor> => {
  const actor = await generate({ alg, extractable: false });
  return actor as IsolatedActor;
};
