import * as jose from "jose";
import { PublicKeyJwk } from "../jose/PublicKeyJwk";
import { DidJwsJwt, DidJwsJwtResolver } from "./types";
import { parseDidUrl } from "../did/parseDidUrl";

import { toDid } from "../did-jwk/toDid";
import { dereferenceWithinDocument } from "../did/dereferenceWithinDocument";
import { getDidDocumentFromVerification } from "./getDidDocumentFromVerification";

export const resolveWithEmbeddedJwk: DidJwsJwtResolver = async ({
  id,
  documentLoader,
}) => {
  const parsed = parseDidUrl<DidJwsJwt>(id);
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
  const issuerDidJwk = toDid(jwk as any);
  const issuerDocumentLoaderResponse = await documentLoader(issuerDidJwk);
  const issuerVerificationMethod = dereferenceWithinDocument({
    id: "#0",
    document: issuerDocumentLoaderResponse.document,
  });
  if (
    (await jose.calculateJwkThumbprint(jwk)) !==
    (await jose.calculateJwkThumbprint(issuerVerificationMethod.publicKeyJwk))
  ) {
    throw new Error("Dereferenced embedded jwk does not match embedded jwk.");
  }
  return getDidDocumentFromVerification({
    did: id,
    issuer: iss as string,
    publicKey: issuerVerificationMethod.publicKeyJwk as PublicKeyJwk,
  });
};
