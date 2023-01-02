/* eslint-disable @typescript-eslint/no-explicit-any */
import transmute, { DidJwkResolver, DidJwtResolver, Service } from "../../src";

import { getActors } from "../util";

describe("transmute", () => {
  describe("did", () => {
    describe("jwt", () => {
      it("dereference", async () => {
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
          claimSet: {
            service: [
              {
                id: "#dwn",
                type: "DecentralizedWebNode",
                serviceEndpoint: {
                  nodes: ["https://dwn.example.com", "https://example.org/dwn"],
                },
              },
            ],
          },
        });

        const trustedDidJwkResolver: DidJwkResolver = async ({ did }) => {
          if (did.startsWith("did:jwk:")) {
            return transmute.did.jwk.resolve({ did });
          }
          return null;
        };
        const trustedDidJwtResolver: DidJwtResolver = async ({ did }) => {
          if (did.startsWith("did:jwt")) {
            return transmute.did.jwt.resolve({
              did,
              // this resolver is used as the "allow list" for embedded JWK.
              resolver: trustedDidJwkResolver,
            });
          }
          return null;
        };
        const service = await transmute.did.jwt.dereference({
          didUrl: `${actor2.did}#dwn`,
          resolver: trustedDidJwtResolver,
        });
        expect((service as Service).id).toBe("#dwn");
      });
    });
  });
});
