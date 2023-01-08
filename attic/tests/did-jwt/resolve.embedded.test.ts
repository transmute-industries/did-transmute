/* eslint-disable @typescript-eslint/no-explicit-any */
import transmute, { ResolveParameters, DidJwk } from "../../src";

import { getActors } from "../util";

// This function must only return verification methods that are trusted.
export const trustedResolver = async ({ did }: ResolveParameters) => {
  if (did.startsWith("did:jwk:")) {
    return transmute.did.jwk.resolve({ did: did as DidJwk });
  }
  return null;
};

describe("transmute", () => {
  describe("did", () => {
    describe("jwt", () => {
      it("resolve", async () => {
        const {
          issuer: {
            did,
            key: { publicKeyJwk, privateKeyJwk },
          },
        } = await getActors(transmute.did.jws.alg.ES256);
        const actor2 = await transmute.did.jwt.sign({
          issuer: did,
          privateKey: privateKeyJwk,
          protectedHeader: {
            alg: publicKeyJwk.alg,
            iss: did,
            jwk: publicKeyJwk,
            kid: "#0",
            cty: "vnd.mycompany.myapp.customer+json; version=2.0",
          },
          claimSet: { "urn:example:claim": true },
        });
        const didDocument = await transmute.did.jwt.resolve({
          did: actor2.did,
          resolver: trustedResolver,
        });
        expect((didDocument as any)["urn:example:claim"]).toBe(true);
        const didDocument2 = await transmute.did.jwt.resolve({
          did: `${actor2.did}#key-that-does-not-exist`,
          resolver: trustedResolver,
        });
        expect(didDocument2).toEqual(didDocument);
      });
    });
  });
});
