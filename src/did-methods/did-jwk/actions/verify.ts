import * as jose from "jose";
import {
  CompactJsonWebSignature,
  SuccessfulVerification,
} from "../../did-jws/types/JsonWebSignature";
import { dereference } from "../dereference";
import { DidUrl } from "../types/DidDocument";
import { PublicKeyJwk } from "../types/JsonWebKey";

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
    const didUrl = kid.startsWith("did:") ? kid : ((iss + kid) as DidUrl);
    const vm = dereference(didUrl);
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
