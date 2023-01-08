import { decrypt } from "./actions/decrypt";
import { DidJweJwt } from "./types";
import { DidJwtDocument } from "./types";

import { PrivateKey } from "../jose/PrivateKey";

export type DidDocumentFromDecryption = {
  did: DidJweJwt;
  issuer: string;
  privateKey: PrivateKey;
};

export const getDidDocumentFromDecryption = async ({
  did,
  issuer,
  privateKey,
}: DidDocumentFromDecryption) => {
  const v = await decrypt({
    did: did as DidJweJwt,
    issuer,
    privateKey,
  });
  const didDocument = {
    "@context": [
      "https://www.w3.org/ns/did/v1",
      { "@vocab": "https://www.iana.org/assignments/jose#" },
    ],
    id: did,
    ...v.payload,
  };
  return didDocument as DidJwtDocument;
};
