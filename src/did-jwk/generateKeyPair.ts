import * as jose from "jose";

import { formatJwk } from "../util/formatJwk";

import { Algorithm } from "../types/Algorithm";

import { ExportableKey } from "../types/ExportableKey";
import { IsolatedKey } from "../types/IsolatedKey";

export type GenerateKeyPair = {
  alg: Algorithm;
  extractable: boolean;
};

export const generateKeyPair = async ({
  alg,
  extractable,
}: GenerateKeyPair): Promise<ExportableKey | IsolatedKey> => {
  const { publicKey, privateKey } = await jose.generateKeyPair(alg, {
    extractable,
  });
  const publicKeyJwk = await jose.exportJWK(publicKey);
  const kid = await jose.calculateJwkThumbprintUri(publicKeyJwk);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const key: any = {
    publicKeyJwk: formatJwk({ ...publicKeyJwk, alg, kid }),
  };
  if (extractable) {
    key.privateKeyJwk = formatJwk({
      ...(await jose.exportJWK(privateKey)),
      alg,
      kid,
    });
  } else {
    key.privateKey = privateKey;
  }
  return extractable ? (key as ExportableKey) : (key as IsolatedKey);
};
