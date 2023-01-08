import * as jose from "jose";

import { formatJwk } from "../jose/formatJwk";

import { Algorithm } from "../jose/Algorithm";

import { ExportableKey } from "../did/ExportableKey";
import { IsolatedKey } from "../did/IsolatedKey";

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
    publicKey: formatJwk({ ...publicKeyJwk, alg, kid }),
  };
  if (extractable) {
    key.privateKey = formatJwk({
      ...(await jose.exportJWK(privateKey)),
      alg,
      kid,
    });
  } else {
    key.privateKey = privateKey;
  }
  return extractable ? (key as ExportableKey) : (key as IsolatedKey);
};
