import { fromDids } from "./fromDids";
import { documentLoader } from "../../did-jwk/actions/documentLoader";
import { DocumentLoader } from "../../did/DocumentLoader";

import { toDid } from "../../did-jwk/toDid";
import { getPublicKeyJwk } from "../../did-jwk/getPublicKeyJwk";

import { CreateFromPrivateKey, ExportableDidWebActor } from "../types";

export const fromPrivateKey = async ({
  url,
  privateKey,
}: CreateFromPrivateKey): Promise<ExportableDidWebActor> => {
  const { did, didDocument } = await fromDids({
    url,
    dids: [toDid(privateKey)],
    documentLoader: documentLoader as DocumentLoader<string>,
  });
  return {
    did,
    didDocument,
    key: {
      publicKey: getPublicKeyJwk(privateKey),
      privateKey: privateKey,
    },
  };
};
