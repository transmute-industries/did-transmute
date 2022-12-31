import { ResolveParameters } from "./ResolveParameters";

import { DidDocument } from "./DidDocument";

export type Resolver = (
  parameters: ResolveParameters
) => Promise<DidDocument | null>;
