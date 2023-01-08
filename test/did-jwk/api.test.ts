/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from "fs";
import transmute, { DidJwk, VerificationMethod } from "../../src";

const fixture: any = {};

const v = JSON.parse(fs.readFileSync("./examples.json").toString());

describe("transmute", () => {
  describe("did", () => {
    describe("jwk", () => {
      describe("generate", () => {
        describe("alg", () => {
          Object.values(transmute.jose.alg).forEach((alg) => {
            it(alg, async () => {
              const e = await transmute.did.jwk.exportable({
                alg,
              });
              fixture[e.did] = e.key.privateKeyJwk;
              expect(e.did.startsWith("did:jwk:")).toBe(true);
              expect(e.key.publicKeyJwk.alg).toBe(alg);
              expect(e.key.privateKeyJwk.alg).toBe(alg);
              const ne = await transmute.did.jwk.isolated({
                alg,
              });
              expect(ne.did.startsWith("did:jwk:")).toBe(true);
              expect(ne.key.publicKeyJwk.alg).toBe(alg);
              expect(ne.key.privateKey).toBeDefined();
              expect((ne.key as any).privateKeyJwk).toBeUndefined();
            });
          });
        });
        // uncomment to rebuild fixtures.
        // afterAll(() => {
        //   fs.writeFileSync("./examples.json", JSON.stringify(fixture, null, 2));
        // });
      });
      describe("resolve & dereference", () => {
        (Object.keys(v) as DidJwk[]).forEach((did) => {
          it(did, async () => {
            const didDocument = await transmute.did.jwk.resolve({ did });
            if (didDocument) {
              expect(didDocument.id).toBe(did);
            }
            const verificationMethod = await transmute.did.jwk.dereference({
              didUrl: `${did}"#0"`,
              resolver: transmute.did.jwk.resolve,
            });
            if (verificationMethod) {
              expect(
                (verificationMethod as VerificationMethod).controller
              ).toBe(did);
            }
          });
        });
      });
    });
  });
});
