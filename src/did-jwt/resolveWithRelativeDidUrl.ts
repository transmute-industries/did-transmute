import * as jose from "jose";
import { DidJwsJwtResolver } from "./types";
import { parseDidUrl } from "../did/parseDidUrl";
import { getDidDocumentFromVerification } from "./getDidDocumentFromVerification";
import { dereferenceWithinDocument } from "../did/dereferenceWithinDocument";
import { DidUrl, PublicKeyJwk } from "../types";
import { AnyDid } from "../types";
import { VerificationMethod } from "../did/VerificationMethod";
export const resolveWithRelativeDidUrl: DidJwsJwtResolver = async ({
  id,
  documentLoader,
}) => {
  const parsed = parseDidUrl<AnyDid>(id);
  const { iss, kid } = jose.decodeProtectedHeader(parsed.id);
  if (!iss) {
    throw new Error("protectedHeader.iss MUST be present.");
  }
  if (!kid) {
    throw new Error("protectedHeader.kid MUST be present.");
  }
  if (kid.startsWith("did:")) {
    throw new Error("protectedHeader.kid MUST be a relative did url.");
  }
  const absoluteDidUrl =
    `${iss}${kid}` as DidUrl<"did:jwt:header.payload.signature#key-0">;
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
