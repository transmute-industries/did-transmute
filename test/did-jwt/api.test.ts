import transmute, { ECDH_ES_A256KW } from "../../src";

import { makeHeader, checks, getActors, claimSet } from "./util";

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
          audience: verifier.did, // audience... optional.
          protectedHeader,
          claimSet,
        });
        const v = await transmute.did.jwt.verify({
          did: subject.did,
          issuer: issuer.did,
          audience: verifier.did, // audience, optional...
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
          audience: verifier.did, // audience, optional...
          publicKey: verifier.key.publicKeyJwk,
        });
        const v = await transmute.did.jwt.decrypt({
          did: subject.did,
          issuer: issuer.did,
          audience: verifier.did,
          privateKey: verifier.key.privateKeyJwk,
        });
        checks(v, alg, protectedHeader, verifier.did);
      });
    });
  });
});
