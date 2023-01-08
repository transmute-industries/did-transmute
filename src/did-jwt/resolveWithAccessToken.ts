import * as jose from "jose";
import { DidJwtResolutionParameters } from "./types";
import { parseDidUrl } from "../did/parseDidUrl";
import { getDidDocumentFromVerification } from "./getDidDocumentFromVerification";
import { dereferenceWithinDocument } from "../did/dereferenceWithinDocument";
import { DidUrl, PublicKeyJwk } from "../types";
import { AnyDid } from "../did/Did";
import { VerificationMethod } from "../did/VerificationMethod";

export const resolveWithAccessToken = async ({
  id,
  documentLoader,
}: DidJwtResolutionParameters) => {
  const parsed = parseDidUrl<AnyDid>(id);
  const { kid } = jose.decodeProtectedHeader(parsed.id);
  const { iss } = jose.decodeJwt(parsed.id);
  if (!kid) {
    throw new Error("protectedHeader.kid MUST be present.");
  }
  if (kid.startsWith("did:")) {
    throw new Error("protectedHeader.kid MUST be a relative did url.");
  }
  // fake news.
  const absoluteDidUrl =
    `${iss}#${kid}` as DidUrl<"did:jwt:header.payload.signature#key-0">;
  const { document: didDocument } = await documentLoader(absoluteDidUrl);
  const verificationMethod = dereferenceWithinDocument<
    VerificationMethod<AnyDid>
  >({
    id: absoluteDidUrl,
    document: didDocument,
  });
  if (verificationMethod === null) {
    throw new Error("Could not dereference verification method.");
  }
  if (!verificationMethod.publicKeyJwk) {
    throw new Error(
      "Computed absolute DID URL did not dereference to a publicKeyJwk."
    );
  }
  return getDidDocumentFromVerification({
    did: id,
    issuer: iss as string,
    publicKey: verificationMethod.publicKeyJwk as PublicKeyJwk,
  });
};
