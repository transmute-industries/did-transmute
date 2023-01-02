import { fromDids } from "./fromDids";
import { resolve } from "../../did-jwk/actions/resolve";

import { PrivateKeyJwk } from "../../../types/PrivateKeyJwk";

import { DidWebActor } from "../../../types/DidWeb";
import { toDid } from "../../did-jwk/toDid";
import { getPublicKeyJwk } from "../../did-jwk/getPublicKeyJwk";

export type FromPrivateKey = {
  url: string;
  privateKey: PrivateKeyJwk;
};

export const fromPrivateKey = async ({
  url,
  privateKey,
}: FromPrivateKey): Promise<DidWebActor> => {
  const { did, didDocument } = await fromDids({
    url,
    dids: [toDid(privateKey)],
    resolver: resolve,
  });
  return {
    did,
    didDocument,
    key: {
      publicKeyJwk: getPublicKeyJwk(privateKey),
      privateKeyJwk: privateKey,
    },
  } as DidWebActor;
};
