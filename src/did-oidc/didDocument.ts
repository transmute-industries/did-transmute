import { Context } from "../did/Context";
import { PublicKeyJwk } from "../types";

export type FakeVerificationMethod<iss extends string> = {
  id: `#${string}`;
  type: "JsonWebKey2020";
  controller: iss;
  publicKeyJwk: PublicKeyJwk;
};

export type FakeDidDocument<iss extends string> = {
  "@context": Array<Context>;
  id: iss;
  verificationMethod: Array<FakeVerificationMethod<iss>>;
  assertionMethod: Array<`#${string}`>;
};

export type FakeDidDocumentParams = {
  iss: string;
  jwks: PublicKeyJwk[];
};

export function didDocument<iss extends string>(
  params: FakeDidDocumentParams
): FakeDidDocument<iss> {
  return {
    "@context": [
      "https://www.w3.org/ns/did/v1",
      { "@vocab": "https://www.iana.org/assignments/jose#" },
    ],
    id: params.iss as iss,
    verificationMethod: params.jwks.map((jwk: PublicKeyJwk) => {
      return {
        id: `#${jwk.kid}`,
        type: "JsonWebKey2020",
        controller: params.iss as iss,
        publicKeyJwk: jwk as PublicKeyJwk,
      };
    }),
    assertionMethod: params.jwks.map((jwk: PublicKeyJwk) => {
      return `#${jwk.kid}`;
    }) as Array<`#${string}`>,
  };
}
