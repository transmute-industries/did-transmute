import { exportable } from "../../did-jwk/actions/exportable";
import { ClaimSet } from "../../jose/ClaimSet";

import { sign } from "./sign";
import { ProtectedHeader } from "../../jose/ProtectedHeader";

import { Algorithm } from "../../jose/Algorithm";
export const actor = async ({
  protectedHeader,
  claimSet,
}: {
  protectedHeader: ProtectedHeader;
  claimSet: ClaimSet;
}) => {
  const root = await exportable({ alg: protectedHeader.alg as Algorithm });
  const delegate = await sign({
    issuer: root.did,
    protectedHeader,
    claimSet,
    privateKey: root.key.privateKey,
  });
  return { root, delegate };
};
