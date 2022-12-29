/* eslint-disable @typescript-eslint/no-explicit-any */
import { generateKeyPair } from "./generateKeyPair";
import { formatJwk } from "./formatJwk";
import { algForKeyOperation } from "./keyOperations";
import { Algorithm } from "./types/Algorithm";
import { KeyOperation } from "./types/KeyOperation";
import { JsonWebKey2020 } from "./types/JsonWebKey";

// TODO: fix extractable case.
export const generateKeyPairForOperation = async (
  keyOperation: KeyOperation
): Promise<JsonWebKey2020> => {
  const recommendedAlg: Algorithm = algForKeyOperation[keyOperation];
  const { publicKeyJwk, privateKeyJwk }: any = await generateKeyPair({
    alg: recommendedAlg,
    extractable: true,
  });
  switch (keyOperation) {
    case "sign": {
      publicKeyJwk.key_ops = ["verify"];
      privateKeyJwk.key_ops = ["sign"];
      break;
    }
    case "encrypt": {
      publicKeyJwk.key_ops = ["encrypt"];
      privateKeyJwk.key_ops = ["decrypt"];
      break;
    }
    case "wrapKey": {
      publicKeyJwk.key_ops = ["wrapKey", "unwrapKey"];
      privateKeyJwk.key_ops = ["wrapKey", "unwrapKey"];
      break;
    }
    case "deriveKey": {
      publicKeyJwk.key_ops = ["deriveKey", "deriveBits"];
      privateKeyJwk.key_ops = ["deriveKey", "deriveBits"];
      break;
    }
    default:
      throw new Error(
        "Unsupported keyOperation. See https://www.rfc-editor.org/rfc/rfc7517.html#section-4.3."
      );
  }
  return {
    publicKeyJwk: formatJwk(publicKeyJwk),
    privateKeyJwk: formatJwk(privateKeyJwk),
  };
};
