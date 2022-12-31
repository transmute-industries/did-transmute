import { ProtectedHeader } from "./ProtectedHeader";
import { ClaimSet } from "./ClaimSet";

export type SuccessfulTokenVerification = {
  payload: ClaimSet;
  protectedHeader: ProtectedHeader;
};
