import { base64url } from "jose";

import { Did } from "../../did/Did";

import { parseDidUrl } from "../../did/parseDidUrl";
import { toDidDocument } from "../toDidDocument";

import { DidJwk, DidJwkDocument } from "../types";

export async function documentLoader(id: Did<DidJwk>) {
  const parsed = parseDidUrl<DidJwk>(id);
  const methodSpecificIdentifier = parsed.id;
  const decoded = base64url.decode(methodSpecificIdentifier);
  const jwk = JSON.parse(new TextDecoder().decode(decoded));
  return { document: toDidDocument(jwk) as unknown as DidJwkDocument };
}
