import { DereferenceParameters } from "./DereferenceParameters";
import { VerificationMethod } from "./VerificationMethod";

export type Dereferencer = (
  parameters: DereferenceParameters
) => Promise<VerificationMethod | null>;
