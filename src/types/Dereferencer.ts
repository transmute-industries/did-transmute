import { DereferenceParameters } from "./DereferenceParameters";
import { DidDocument } from "./DidDocument";
import { VerificationMethod } from "./VerificationMethod";
export type Dereferencer = (
  parameters: DereferenceParameters
) => Promise<DidDocument | VerificationMethod | null>;
