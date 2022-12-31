import { KeyOperation } from "./KeyOperation";
import { Algorithm } from "./Algorithm";
// https://www.iana.org/assignments/jose/jose.xhtml#web-key-parameters

export type PublicKeyJwk = {
  kty?: string;
  use?: string;
  key_ops?: KeyOperation[];
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
} & {
  alg: Algorithm; // required algorithms with known types... because...
};
