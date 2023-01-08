import { IsolatedActor } from "../../types";
import { Algorithm } from "../../jose/Algorithm";
import { generate } from "./generate";

import { DidJwk } from "../types";

export type Isolated = {
  alg: Algorithm;
};

export const isolated = async ({
  alg,
}: Isolated): Promise<IsolatedActor<DidJwk>> => {
  const actor = await generate({ alg, extractable: false });
  return actor as IsolatedActor<DidJwk>;
};
