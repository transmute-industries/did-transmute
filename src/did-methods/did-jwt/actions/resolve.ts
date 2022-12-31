import * as jose from "jose";

import { DidDocument } from "../../../types/DidDocument";

import { Resolver } from "../../../types/Resolver";

import { parseDidUrl } from "../../../util/parseDidUrl";

import { verify } from "./verify";

import { DidJwt, DidJwtUrl } from "../../../types/DidJwt";
import { prefix } from "../method";
import { PublicKeyJwk } from "../../../types";

import { dereferenceWithResolver } from "../../../util/dereferenceWithResolver";

export type DidJwtResolver = {
  did: DidJwt;
  resolver: Resolver; // DidJwkResolver...
};

// Resolve Embedded
// https://www.pingidentity.com/en/resources/blog/post/jwt-security-nobody-talks-about.html
// TLDR:
// Trust the jwk if the issuer did document contains it (which will always be true for did:jwk).
// did:jwt payload claimSet is used as didDocument members.
const resolveEmbedded = async (did: DidJwt, resolver: Resolver) => {
  const jws = did.split(":").pop() as string;
  // this part....
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { iss, kid, jwk, alg } = jose.decodeProtectedHeader(jws) as any;
  // this part....
  const item = await dereferenceWithResolver({ didUrl: iss + kid, resolver });
  if (!item) {
    throw new Error("Cannot dereference public key.");
  }
  if (
    (await jose.calculateJwkThumbprint(jwk)) !==
    (await jose.calculateJwkThumbprint(item.publicKeyJwk as PublicKeyJwk))
  ) {
    throw new Error("Issuer does does not control header.jwk.");
  }
  if (alg !== jwk.alg) {
    throw new Error(
      "Algorithm mismatch. Expected 'header.alg' to be 'header.jwk.alg'."
    );
  }
  const v = await verify({
    did: did as DidJwtUrl,
    issuer: iss,
    publicKey: jwk,
  });
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

export const resolve = async ({
  did,
  resolver,
}: DidJwtResolver): Promise<DidDocument | null> => {
  if (!did.startsWith(prefix)) {
    return null;
  }
  const parsedDid = parseDidUrl(did);
  const jws = parsedDid.did.split(":").pop() as string;
  const { jwk } = jose.decodeProtectedHeader(jws);
  if (jwk) {
    return resolveEmbedded(parsedDid.did as DidJwt, resolver);
  }
  return null;
};
