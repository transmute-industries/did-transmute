import { DocumentLoader } from "./DocumentLoader";

export type DidDereferenceParameters<DidUrl> = {
  id: DidUrl;
  documentLoader: DocumentLoader<DidUrl>;
};
