import { ProtectedHeader } from "./ProtectedHeader";

export type SuccessfulVerification = {
  payload: Uint8Array;
  protectedHeader: ProtectedHeader;
};
