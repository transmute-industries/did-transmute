import transmute from "../../src";

import { getActors } from "../util";

describe("transmute", () => {
  describe("did", () => {
    describe("jwt", () => {
      it("sign & verify", async () => {
        const alg = transmute.did.jws.alg.ES256;
        const { issuer, verifier } = await getActors(alg);
        const protectedHeader = {
          alg,
          iss: issuer.did,
          kid: "#0",
          cty: "vnd.mycompany.myapp.customer+json; version=2.0",
        };
        const subject = await transmute.did.jwt.sign({
          issuer: issuer.did,
          privateKey: issuer.key.privateKeyJwk,
          audience: verifier.did, // audience... optional.
          protectedHeader,
          claimSet: { "urn:example:claim": true },
        });
        const v = await transmute.did.jwt.verify({
          did: subject.did,
          issuer: issuer.did,
          audience: verifier.did, // audience, optional...
          publicKey: issuer.key.publicKeyJwk,
        });
        expect(v.protectedHeader.alg).toBe(alg);
        expect(v.protectedHeader.iss).toBe(protectedHeader.iss);
        expect(v.protectedHeader.kid).toBe(protectedHeader.kid);
        expect(v.protectedHeader.cty).toBe(protectedHeader.cty);
        expect(v.payload.aud).toBe(verifier.did);
        expect(v.payload["urn:example:claim"]).toBe(true);
      });
      it("encrypt & decrypt", async () => {
        const alg = transmute.did.jwe.alg.ECDH_ES_A256KW;
        const enc = transmute.did.jwe.enc.A256GCM;
        const { issuer, verifier } = await getActors(alg);
        const protectedHeader = {
          alg,
          enc,
          iss: issuer.did,
          kid: "#0",
          cty: "vnd.mycompany.myapp.customer+json; version=2.0",
        };
        const subject = await transmute.did.jwt.encrypt({
          issuer: issuer.did,
          protectedHeader,
          claimSet: { "urn:example:claim": true },
          audience: verifier.did, // audience, optional...
          publicKey: verifier.key.publicKeyJwk,
        });
        const v = await transmute.did.jwt.decrypt({
          did: subject.did,
          issuer: issuer.did,
          audience: verifier.did,
          privateKey: verifier.key.privateKeyJwk,
        });
        expect(v.protectedHeader.alg).toBe(alg);
        expect(v.protectedHeader.iss).toBe(protectedHeader.iss);
        expect(v.protectedHeader.kid).toBe(protectedHeader.kid);
        expect(v.protectedHeader.cty).toBe(protectedHeader.cty);
        expect(v.payload.aud).toBe(verifier.did);
        expect(v.payload["urn:example:claim"]).toBe(true);
      });
    });
  });
});
