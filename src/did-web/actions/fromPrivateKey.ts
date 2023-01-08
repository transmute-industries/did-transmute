import { fromDids } from "./fromDids";
import { documentLoader } from "../../did-jwk/actions/documentLoader";

import { PrivateKeyJwk } from "../../jose/PrivateKeyJwk";

import { toDid } from "../../did-jwk/toDid";
import { getPublicKeyJwk } from "../../did-jwk/getPublicKeyJwk";

export type FromPrivateKey = {
  url: string;
  privateKey: PrivateKeyJwk;
};

export const fromPrivateKey = async ({
  url,
  privateKey,
}: FromPrivateKey): Promise<any> => {
  const { did, didDocument } = await fromDids({
    url,
    dids: [toDid(privateKey)],
    documentLoader: documentLoader,
  });
  return {
    did,
    didDocument,
    key: {
      publicKeyJwk: getPublicKeyJwk(privateKey),
      privateKeyJwk: privateKey,
    },
  };
};
