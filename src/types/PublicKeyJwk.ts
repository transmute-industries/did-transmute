// https://www.iana.org/assignments/jose/jose.xhtml#web-key-parameters

export type PublicKeyJwk = {
  kty?: string;
  use?: string;
  key_ops?: string[];
  alg?: string;
  kid?: string;
  x5u?: string;
  x5c?: string[];
  x5t?: string;
  "x5t#S256"?: string;
  crv?: string;
  x?: string;
  y?: string;
  n?: string;
  e?: string;
  ext?: boolean;
  [propertyName: string]: unknown;
};
