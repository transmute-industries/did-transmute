import { DocumentLoader } from "./DocumentLoader";

export type DidResolutionParameters<Did> = {
  id: Did;
  documentLoader: DocumentLoader<Did>;
};
