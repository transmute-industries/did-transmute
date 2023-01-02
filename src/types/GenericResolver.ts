import { Did } from "./Did";
import { DidDocument } from "./DidDocument";

export type GenericResolver = (parameters: {
  did: Did;
}) => Promise<DidDocument | null>;
