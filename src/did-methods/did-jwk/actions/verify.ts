import * as jose from "jose";

import { dereference } from "../dereference";
import { DidUrl } from "../../../types/DidUrl";
import { PublicKeyJwk } from "../../../types/PublicKeyJwk";

import { CompactJsonWebSignature } from "../../../types/CompactJsonWebSignature";

import { SuccessfulVerification } from "../../../types/SuccessfulVerification";

export type Verify = {
  jws: CompactJsonWebSignature;
  publicKey?: PublicKeyJwk;
};

export const verify = async ({
  jws,
  publicKey,
}: Verify): Promise<SuccessfulVerification> => {
  let key;
  if (!publicKey) {
    const { iss, kid } = jose.decodeProtectedHeader(jws);
    if (!kid) {
      throw new Error("JWS must contain kid");
    }
    const didUrl = kid.startsWith("did:") ? kid : iss + kid;
    const vm = dereference(didUrl as DidUrl);
    if (vm === null) {
      throw new Error("Could not dereference public key");
    }
    key = await jose.importJWK(vm.publicKeyJwk);
  } else {
    key = await jose.importJWK(publicKey);
  }
  const { payload, protectedHeader } = await jose.compactVerify(jws, key);
  return { payload, protectedHeader } as SuccessfulVerification;
};
