import { DidWeb } from "./types";

export const endpointToDid = (endpoint: string): DidWeb => {
  const url = new URL(endpoint);
  const { pathname } = url;
  let { host } = url;
  if (host.includes(":")) {
    host = encodeURIComponent(host);
  }
  if (endpoint.includes(".well-known/did.json")) {
    return `did:web:${host}`;
  }
  return `did:web:${host}${pathname
    .replace(/\//g, ":")
    .replace(":did.json", "")}`;
};
