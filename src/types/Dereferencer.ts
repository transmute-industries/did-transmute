import { DidDocument } from "./DidDocument";
import { VerificationMethod } from "./VerificationMethod";
// delete me
export type Dereferencer = (
  parameters: any
) => Promise<DidDocument | VerificationMethod | null>;
