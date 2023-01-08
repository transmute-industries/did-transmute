import * as jose from "jose";

import { DidJwtResolver, Resolver, PublicKeyJwk } from "../../types";
import { dereferenceWithResolver } from "../../util/dereferenceWithResolver";
import { getDidDocumentFromVerification } from "./getDidDocumentFromVerification";

export const resolveWithIss: DidJwtResolver = async ({ did, resolver }) => {
  const jws = did.split(":").pop() as string;
  const { iss, kid } = jose.decodeProtectedHeader(jws) as any;
  let didUrl = kid;
  if (kid.startsWith("did:")) {
    if (!kid.startsWith(iss)) {
      throw new Error(
        "Expected kid to start with iss when kid is absolute DID URL."
      );
    }
  } else {
    didUrl = iss + kid;
  }
  const verificationMethod = await dereferenceWithResolver({
    didUrl: didUrl,
    resolver: resolver as Resolver, // allow list
  });
  let allowedKey = null;
  if (verificationMethod) {
    allowedKey = verificationMethod.publicKeyJwk as PublicKeyJwk;
  }
  if (!allowedKey) {
    throw new Error("Cannot dereference public key.");
  }
  return getDidDocumentFromVerification({
    did,
    issuer: iss,
    publicKey: allowedKey as PublicKeyJwk,
  });
};
