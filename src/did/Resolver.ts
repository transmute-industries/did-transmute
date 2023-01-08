import {
  DocumentLoaderResponse,
  DocumentLoaderDocument,
} from "./DocumentLoader";

import { DidResolutionParameters } from "./DidResolutionParameters";

export type Resolver<Did> = (
  parameters: DidResolutionParameters<Did>
) => DocumentLoaderResponse<DocumentLoaderDocument<Did>>;
