import * as jose from "jose";
import { PublicKeyJwk } from "../jose/PublicKeyJwk";
import { DidJwtResolutionParameters } from "./types";
import { parseDidUrl } from "../did/parseDidUrl";

import { toDid } from "../did-jwk/toDid";
import { dereferenceWithinDocument } from "../did/dereferenceWithinDocument";
import { getDidDocumentFromVerification } from "./getDidDocumentFromVerification";
import { VerificationMethod } from "../did/VerificationMethod";
import { DidJwk } from "../types";
import { AnyDid } from "../did/Did";

export const resolveWithEmbeddedJwk = async ({
  id,
  documentLoader,
}: DidJwtResolutionParameters) => {
  const parsed = parseDidUrl<AnyDid>(id);
  const { alg, jwk } = jose.decodeProtectedHeader(parsed.id);
  const { iss } = jose.decodeJwt(parsed.id);
  if (!jwk) {
    throw new Error(
      "protectedHeader.jwk MUST be defined to resolveWithEmbeddedJwk"
    );
  }
  if (alg !== (jwk as PublicKeyJwk).alg) {
    throw new Error(
      "Algorithm mismatch. Expected 'header.alg' to be 'header.jwk.alg'."
    );
  }
  const issuer = toDid(jwk as PublicKeyJwk);
  const { document } = await documentLoader(issuer);
  const verificationMethod = dereferenceWithinDocument<
    VerificationMethod<DidJwk>
  >({
    id: "#0",
    document: document,
  });
  if (verificationMethod === null) {
    throw new Error("Could not dereference verification method.");
  }
  if (
    (await jose.calculateJwkThumbprint(jwk)) !==
    (await jose.calculateJwkThumbprint(verificationMethod.publicKeyJwk))
  ) {
    throw new Error("Dereferenced embedded jwk does not match embedded jwk.");
  }
  return getDidDocumentFromVerification({
    did: id,
    issuer: iss as DidJwk,
    publicKey: verificationMethod.publicKeyJwk,
  });
};
