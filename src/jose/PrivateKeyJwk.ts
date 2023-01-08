import { PublicKeyJwk } from "./PublicKeyJwk";

// https://www.iana.org/assignments/jose/jose.xhtml#web-key-parameters

export type PrivateKeyJwk = PublicKeyJwk & {
  d?: string;
  p?: string;
  q?: string;
  dp?: string;
  dq?: string;
  qi?: string;
  oth?: Array<{
    d?: string;
    r?: string;
    t?: string;
  }>;
  k?: string; // Symmetric
};
