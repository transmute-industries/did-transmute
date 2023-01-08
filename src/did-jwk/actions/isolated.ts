import { Algorithm } from "../../jose/Algorithm";
import { generate } from "./generate";

import { IsolatedDidJwkActor } from "../types";

export type Isolated = {
  alg: Algorithm;
};

export const isolated = async ({
  alg,
}: Isolated): Promise<IsolatedDidJwkActor> => {
  const actor = await generate({ alg, extractable: false });
  return actor as IsolatedDidJwkActor;
};
