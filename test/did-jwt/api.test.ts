import transmute, { ECDH_ES_A256KW, ExtractableActor } from "../../src";

const getActors = async (alg: any) => {
  const issuer = await transmute.did.jwk.generate({
    alg,
    extractable: true,
  });
  const verifier = await transmute.did.jwk.generate({
    alg,
    extractable: true,
  });
  const trustKeys = {
    [issuer.did + "#0"]: issuer.key,
    [verifier.did + "#0"]: verifier.key,
  };
  const trustStore = {
    dereference: (did: any) => {
      return trustKeys[did];
    },
  };
  return {
    issuer: issuer as ExtractableActor,
    verifier: verifier as ExtractableActor,
    trustStore,
  };
};

const claimSet = { "urn:example:claim": true };

const checks = (v: any, alg: any, protectedHeader: any, audience: any) => {
  expect(v.protectedHeader.alg).toBe(alg);
  expect(v.protectedHeader.iss).toBe(protectedHeader.iss);
  expect(v.protectedHeader.kid).toBe(protectedHeader.kid);
  expect(v.protectedHeader.cty).toBe(protectedHeader.cty);
  // expect(v.payload.aud).toBe(audience);
  expect(v.payload["urn:example:claim"]).toBe(true);
};

const makeHeader = (data: any) => {
  const protectedHeader = {
    ...data,
    kid: "#0",
    cty: "vnd.mycompany.myapp.customer+json; version=2.0",
  };
  return protectedHeader;
};

describe("transmute", () => {
  describe("did", () => {
    describe("jwt", () => {
      it("sign & verify", async () => {
        const alg = transmute.did.jws.alg.ES256;
        const { issuer, verifier } = await getActors(alg);
        const protectedHeader = makeHeader({
          alg,
          iss: issuer.did,
        });
        const subject = await transmute.did.jwt.sign({
          issuer: issuer.did,
          privateKey: issuer.key.privateKeyJwk,
          // audience: verifier.did, // audience... optional.
          protectedHeader,
          claimSet,
        });
        const v = await transmute.did.jwt.verify({
          did: subject.did,
          issuer: issuer.did,
          // audience: verifier.did, // audience, optional...
          publicKey: issuer.key.publicKeyJwk,
        });
        checks(v, alg, protectedHeader, verifier.did);
      });
      it("encrypt & decrypt", async () => {
        const alg = transmute.did.jwe.alg[ECDH_ES_A256KW];
        const enc = transmute.did.jwe.enc.A256GCM;
        const { issuer, verifier } = await getActors(alg);
        const protectedHeader = makeHeader({
          alg,
          enc,
          iss: issuer.did,
        });
        const subject = await transmute.did.jwt.encrypt({
          issuer: issuer.did,
          protectedHeader,
          claimSet,
          // audience: verifier.did, // audience, optional...
          publicKey: verifier.key.publicKeyJwk,
        });
        const v = await transmute.did.jwt.decrypt({
          did: subject.did,
          issuer: issuer.did,
          // audience: verifier.did,
          privateKey: verifier.key.privateKeyJwk,
        });
        checks(v, alg, protectedHeader, verifier.did);
      });
    });
  });
});
