import { base64url } from "jose";

import { Did } from "../../did/Did";

import { DocumentLoader } from "../../did/DocumentLoader";

import { parseDidUrl } from "../../did/parseDidUrl";
import { toDidDocument } from "../toDidDocument";

import { DidJwk } from "../types";

export async function documentLoader(id: Did<DidJwk>) {
  const parsed = parseDidUrl<DidJwk>(id);
  const methodSpecificIdentifier = parsed.id;
  const decoded = base64url.decode(methodSpecificIdentifier);
  const jwk = JSON.parse(new TextDecoder().decode(decoded));
  return { document: toDidDocument(jwk) };
}

documentLoader as DocumentLoader<DidJwk>;
