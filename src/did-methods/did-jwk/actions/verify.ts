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
  publicKeyJwk?: PublicKeyJwk;
};

export const verify = async ({
  jws,
  publicKeyJwk,
}: Verify): Promise<SuccessfulVerification> => {
  let publicKey;
  if (!publicKeyJwk) {
    const { iss, kid } = jose.decodeProtectedHeader(jws);
    if (!kid) {
      throw new Error("JWS must contain kid");
    }
    const didUrl = kid.startsWith("did:") ? kid : ((iss + kid) as DidUrl);

    const vm = dereference(didUrl);

    if (vm === null) {
      throw new Error("Could not dereference public key");
    }
    publicKey = await jose.importJWK(vm.publicKeyJwk);
  } else {
    publicKey = await jose.importJWK(publicKeyJwk);
  }

  const { payload, protectedHeader } = await jose.compactVerify(jws, publicKey);
  return { payload, protectedHeader } as SuccessfulVerification;
};
