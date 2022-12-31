import { ProtectedHeader } from "./ProtectedHeader";

export type SuccessfulDecryption = {
  plaintext: Uint8Array;
  protectedHeader: ProtectedHeader;
};
