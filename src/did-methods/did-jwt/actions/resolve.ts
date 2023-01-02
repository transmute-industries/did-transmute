import * as jose from "jose";

import { DidDocument } from "../../../types/DidDocument";

import { Resolver } from "../../../types/Resolver";

import { parseDidUrl } from "../../../util/parseDidUrl";

import { verify } from "./verify";

import { DidJwkResolver } from "../../../types/DidJwk";
import { DidJwt, DidJwtUrl, DidJwtResolver } from "../../../types/DidJwt";
import { prefix } from "../method";
import { PublicKeyJwk } from "../../../types";

import { dereferenceWithResolver } from "../../../util/dereferenceWithResolver";
import { toDid } from "../../did-jwk/toDid";

// Resolve Embedded
// https://www.pingidentity.com/en/resources/blog/post/jwt-security-nobody-talks-about.html
// TLDR:
// Trust the jwk if the issuer did document contains it (which will always be true for did:jwk).
// did:jwt payload claimSet is used as didDocument members.
const resolveEmbedded = async (did: DidJwt, resolver: DidJwkResolver) => {
  const jws = did.split(":").pop() as string;
  // this part....
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { iss, kid, jwk, alg } = jose.decodeProtectedHeader(jws) as any;
  // Need to handle each resolution case here...

  let allowedKey = null;
  if (jwk) {
    // console.warn("did:jwt resolution for embedded jwk is experimental");
    const item = await dereferenceWithResolver({
      didUrl: `${toDid(jwk)}#0`,
      resolver: resolver as Resolver,
    });
    if (item) {
      allowedKey = item.publicKeyJwk as PublicKeyJwk;
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
  if (iss || kid) {
    // console.warn("did:jwt resolution for 'iss' and 'kid' not implemented.");
    const item = await dereferenceWithResolver({
      didUrl: iss + kid,
      resolver: resolver as Resolver,
    });
    if (item) {
      allowedKey = item.publicKeyJwk as PublicKeyJwk;
    }
  }
  if (!allowedKey) {
    throw new Error("Cannot dereference public key.");
  }

  const v = await verify({
    did: did as DidJwtUrl,
    issuer: iss,
    publicKey: allowedKey as PublicKeyJwk,
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

export const resolve: DidJwtResolver = async ({ did, resolver }) => {
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
