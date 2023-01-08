import { CompactJWEHeaderParameters } from "jose";
import { prefix } from "../method";
import { PublicKey } from "../../../types/PublicKey";

import { DidJweActor } from "../../../types/DidJwe";

import { encryptToKey } from "../../../jose/encryptToKey";

export type Encrypt = {
  publicKey: PublicKey;
  plaintext: Uint8Array;
  protectedHeader: CompactJWEHeaderParameters;
};

export const encrypt = async ({
  plaintext,
  publicKey,
  protectedHeader,
}: Encrypt) => {
  const jwe = await encryptToKey({ plaintext, publicKey, protectedHeader });
  const did = `${prefix}:${jwe}`;
  return { did: did } as DidJweActor;
};
