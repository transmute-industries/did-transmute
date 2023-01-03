import * as jose from "jose";

import { DidJwtResolver, Resolver, PublicKeyJwk } from "../../types";

import { toDid } from "../did-jwk/toDid";
import { getDidDocumentFromVerification } from "./getDidDocumentFromVerification";

import { dereferenceWithResolver } from "../../util/dereferenceWithResolver";

export const resolveWithEmbeddedJwk: DidJwtResolver = async ({
  did,
  resolver, // as allow-list
}) => {
  const jws = did.split(":").pop() as string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { iss, jwk, alg } = jose.decodeProtectedHeader(jws) as any;
  let allowedKey = null;
  if (jwk) {
    // console.warn("did:jwt resolution for embedded jwk is experimental");
    const verificationMethod = await dereferenceWithResolver({
      didUrl: `${toDid(jwk)}#0`,
      resolver: resolver as Resolver,
    });
    // this will fail for any "did:jwk" that is "not allowed"
    // this will pass for any "did:jwk" that is "allowed" (resolves successfully)
    if (verificationMethod) {
      allowedKey = verificationMethod.publicKeyJwk as PublicKeyJwk;
      if (
        (await jose.calculateJwkThumbprint(jwk)) !==
        (await jose.calculateJwkThumbprint(allowedKey))
      ) {
        throw new Error("Allowed key does not control header.jwk.");
      }
    }
    if (alg !== jwk.alg) {
      throw new Error(
        "Algorithm mismatch. Expected 'header.alg' to be 'header.jwk.alg'."
      );
    }
  }
  return getDidDocumentFromVerification({
    did,
    issuer: iss,
    publicKey: allowedKey as PublicKeyJwk,
  });
};
