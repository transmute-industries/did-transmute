import transmute, { ECDH_ES_A256KW, ExtractableActor } from "../../src";

describe("transmute", () => {
  describe("did", () => {
    describe("jwt", () => {
      it("sign & verify", async () => {
        const alg = transmute.did.jws.alg.ES256;
        const issuer = await transmute.did.jwk.generate({
          alg,
          extractable: true,
        });
        const verifier = await transmute.did.jwk.generate({
          alg,
          extractable: true,
        });
        const protectedHeader = {
          alg,
          iss: issuer.did,
          kid: "#0",
          cty: "vnd.mycompany.myapp.customer+json; version=2.0",
        };
        const claimSet = { "urn:example:claim": true };
        const holder = await transmute.did.jwt.sign({
          issuer: issuer.did,
          verifier: verifier.did, //  const audience = verifier.did;
          // holder here?... FAL3
          protectedHeader,
          claimSet,
          privateKey: (issuer as ExtractableActor).key.privateKeyJwk,
        });
        const v = await transmute.did.jwt.verify({
          did: holder.did,
        });
        expect(v.protectedHeader.alg).toBe(alg);
        expect(v.protectedHeader.iss).toBe(issuer.did);
        expect(v.protectedHeader.kid).toBe(protectedHeader.kid);
        expect(v.protectedHeader.cty).toBe(protectedHeader.cty);
        expect(v.payload.aud).toBe(verifier.did);
        expect(v.payload["urn:example:claim"]).toBe(true);
      });

      it.only("encrypt & decrypt", async () => {
        const alg = transmute.did.jwe.alg[ECDH_ES_A256KW];
        const enc = transmute.did.jwe.enc.A256GCM;
        const issuer = await transmute.did.jwk.generate({
          alg,
          extractable: true,
        });
        const verifier = await transmute.did.jwk.generate({
          alg,
          extractable: true,
        });
        const protectedHeader = {
          alg,
          enc,
          iss: issuer.did,
          kid: "#0",
          cty: "vnd.mycompany.myapp.customer+json; version=2.0",
        };
        const claimSet = { "urn:example:claim": true };
        const holder = await transmute.did.jwt.encrypt({
          issuer: issuer.did,
          verifier: verifier.did, //  const audience = verifier.did;
          // holder here?... FAL3
          protectedHeader,
          claimSet,
          publicKey: verifier.key.publicKeyJwk,
        });
        const v = await transmute.did.jwt.decrypt({
          did: holder.did,
          issuer: issuer.did,
          verifier: verifier.did,
          privateKey: (verifier as ExtractableActor).key.privateKeyJwk,
        });
        expect(v.protectedHeader.alg).toBe(alg);
        expect(v.protectedHeader.iss).toBe(issuer.did);
        expect(v.protectedHeader.kid).toBe(protectedHeader.kid);
        expect(v.protectedHeader.cty).toBe(protectedHeader.cty);
        expect(v.payload.aud).toBe(verifier.did);
        expect(v.payload["urn:example:claim"]).toBe(true);
      });
    });
  });
});
