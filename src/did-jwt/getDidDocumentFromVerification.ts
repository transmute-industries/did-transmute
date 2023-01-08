import { PublicKeyJwk } from "../types";
import { verify } from "./actions/verify";
import { DidJwsJwt } from "./types";
import { DidJwsJwtDocument } from "./types";
import { AnyDid } from "../did/Did";
export type DidDocumentFromVerification = {
  did: AnyDid;
  issuer: string;
  publicKey: PublicKeyJwk;
};

export const getDidDocumentFromVerification = async ({
  did,
  issuer,
  publicKey,
}: DidDocumentFromVerification) => {
  const v = await verify({
    did: did as DidJwsJwt,
    issuer,
    publicKey,
  });
  const didDocument = {
    "@context": [
      "https://www.w3.org/ns/did/v1",
      { "@vocab": "https://www.iana.org/assignments/jose#" },
    ],
    id: did,
    ...v.payload,
  };
  return didDocument as DidJwsJwtDocument;
};
