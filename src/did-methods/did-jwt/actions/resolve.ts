import * as jose from "jose";

import { DidDocument } from "../../../types/DidDocument";

import { Dereferencer } from "../../../types/Dereferencer";

import { parseDidUrl } from "../../../util/parseDidUrl";

import { verify } from "./verify";
import { DidUrl } from "../../../types/DidUrl";
import { DidJwtUrl } from "../../../types/DidJwt";

export type Resolve = {
  didUrl: DidJwtUrl;
  dereference: Dereferencer;
};

// Resolve Embedded
// https://www.pingidentity.com/en/resources/blog/post/jwt-security-nobody-talks-about.html
// TLDR:
// Trust the jwk if the issuer did document contains it (which will always be true for did:jwk).
// did:jwt payload claimSet is used as didDocument members.
const dereferenceEmbedded = async (
  didUrl: DidUrl,
  dereference: Dereferencer
) => {
  const { did } = parseDidUrl(didUrl) as any;
  const jws = didUrl.split(":").pop() as string;
  const { iss, kid, jwk, alg } = jose.decodeProtectedHeader(jws) as any;
  // this part....
  const vm = await dereference({ didUrl: iss + kid });
  if (!vm) {
    throw new Error("Cannot dereference public key.");
  }
  if (
    (await jose.calculateJwkThumbprint(jwk)) !==
    (await jose.calculateJwkThumbprint(vm.publicKeyJwk))
  ) {
    throw new Error("Issuer does does not control header.jwk.");
  }
  if (alg !== jwk.alg) {
    throw new Error(
      "Algorithm mismatch. Expected 'header.alg' to be 'header.jwk.alg'."
    );
  }
  const v = await verify({ did, issuer: iss, publicKey: jwk });
  const didDocument = {
    "@context": [
      "https://www.w3.org/ns/did/v1",
      { "@vocab": "https://www.iana.org/assignments/jose#" },
    ],
    id: did,
    ...v.payload,
  };
  return didDocument as DidDocument;
};

export const resolve = async ({ didUrl, dereference }: Resolve) => {
  const jws = didUrl.split(":").pop() as string;
  const { jwk } = jose.decodeProtectedHeader(jws);
  if (jwk) {
    return dereferenceEmbedded(didUrl, dereference);
  }
  return null;
};
