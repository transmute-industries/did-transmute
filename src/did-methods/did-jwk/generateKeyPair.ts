import * as jose from "jose";

import { formatJwk } from "./formatJwk";
import { PrivateKeyJwk, PublicKeyJwk } from "./types/JsonWebKey";

import { Algorithm } from "./types/Algorithm";
import { ControllerKey } from "./types/ControllerKey";

export type GenerateKeyPair = {
  alg: Algorithm;
  extractable: boolean;
};

export const generateKeyPair = async ({
  alg,
  extractable,
}: GenerateKeyPair): Promise<ControllerKey> => {
  const { publicKey, privateKey } = await jose.generateKeyPair(alg, {
    extractable,
  });
  const publicKeyJwk = (await jose.exportJWK(publicKey)) as PublicKeyJwk;
  const kid = await jose.calculateJwkThumbprintUri(publicKeyJwk);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const controllerKey: any = {
    publicKeyJwk: formatJwk({ ...publicKeyJwk, alg, kid }),
  };
  if (extractable) {
    controllerKey.privateKeyJwk = formatJwk({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...((await jose.exportJWK(privateKey)) as any),
      alg,
      kid,
    }) as PrivateKeyJwk;
  } else {
    controllerKey.privateKey = privateKey;
  }
  return controllerKey as ControllerKey;
};
