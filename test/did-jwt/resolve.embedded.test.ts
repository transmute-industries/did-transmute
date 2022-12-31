import transmute from "../../src";

import { getActors, trustedDereferencer } from "../util";

describe("transmute", () => {
  describe("did", () => {
    describe("jwt", () => {
      it("resolve", async () => {
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
          claimSet: { "urn:example:claim": true },
        });
        const didDocument = await transmute.did.jwt.resolve({
          didUrl: actor2.did,
          dereference: trustedDereferencer,
        });
        if (didDocument) {
          expect(didDocument["urn:example:claim"]).toBe(true);
        }
      });
    });
  });
});
