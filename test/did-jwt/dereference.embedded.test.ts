/* eslint-disable @typescript-eslint/no-explicit-any */
import transmute, {
  Did,
  DidJwk,
  DidJwt,
  ResolveParameters,
  Service,
} from "../../src";

import { getActors } from "../util";

// This function must only return verification methods that are trusted.
export const trustedResolver = async ({ did }: ResolveParameters) => {
  if (did.startsWith("did:jwk:")) {
    return transmute.did.jwk.resolve({ did });
  }
  return null;
};

describe("transmute", () => {
  describe("did", () => {
    describe("jwt", () => {
      it("dereference", async () => {
        const { issuer } = await getActors(transmute.did.jws.alg.ES256);
        const actor2 = await transmute.did.jwt.sign({
          issuer: issuer.did,
          privateKey: issuer.key.privateKeyJwk,
          protectedHeader: {
            alg: issuer.key.publicKeyJwk.alg,
            iss: issuer.did,
            jwk: issuer.key.publicKeyJwk,
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
        const service = await transmute.did.jwt.dereference({
          didUrl: `${actor2.did}#dwn`,
          resolver: async ({ did }: { did: Did }) => {
            if (did.startsWith("did:jwk")) {
              return transmute.did.jwk.resolve({
                did: did as DidJwk,
              });
            }
            if (did.startsWith("did:jwt")) {
              return transmute.did.jwt.resolve({
                did: did as DidJwt,
                resolver: transmute.did.jwk.resolve, // confusing, but needed...
              });
            }
            return null;
          },
        });
        expect((service as Service).id).toBe("#dwn");
      });
    });
  });
});
