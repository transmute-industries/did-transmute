/* eslint-disable @typescript-eslint/no-explicit-any */

import transmute from "../../src";

describe("transmute", () => {
  describe("did", () => {
    describe("web", () => {
      it("fromDids", async () => {
        const actor0 = await transmute.did.jwk.exportable({
          alg: transmute.did.jws.alg.ES256,
        });
        const actor1 = await transmute.did.jwt.sign({
          issuer: actor0.did,
          privateKey: actor0.key.privateKeyJwk,
          protectedHeader: {
            alg: actor0.key.publicKeyJwk.alg,
            jwk: actor0.key.publicKeyJwk,
            iss: actor0.did, // why is this required here?
            kid: "#0",
            cty: "vnd.mycompany.myapp.customer+json; version=2.0",
          },
          claimSet: { "urn:example:claim": true },
        });

        const trustedResolver: any = async ({ did }: any) => {
          if (did.startsWith("did:jwk:")) {
            return transmute.did.jwk.resolve({ did });
          }
          if (did.startsWith("did:jwt")) {
            return transmute.did.jwt.resolve({
              did,
              // this resolver is used as the "allow list" for embedded JWK.
              // this move will trust all valid keys.
              // for testing purposes.
              resolver: transmute.did.jwk.resolve,
            });
          }
          return null;
        };
        const actor2 = await transmute.did.web.fromDids({
          url: "https://id.gs1.org/01/9506000134352",
          dids: [actor0.did, actor1.did],
          resolver: trustedResolver,
        });
        expect(actor2.didDocument["urn:example:claim"]).toBe(true);
      });
    });
  });
});
