import { base64url } from "jose";

import { Did } from "../../types/Did";

import { DocumentLoader } from "../../types/DocumentLoader";

import { parseDidUrl } from "../../util/parseDidUrl";
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
