import { Did } from "./Did";
import { DidDocument } from "./DidDocument";
import { ExportableKey } from "./ExportableKey";

export type ExportableActor = {
  did: Did;
  key: ExportableKey;
  didDocument?: DidDocument;
};
