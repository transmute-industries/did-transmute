/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from "fs";
import transmute, { Did, ExportableActor, IsolatedActor } from "../../src";

const fixture: any = {};
const message = "It’s a dangerous business, Frodo, going out your door. 🧠💎";
const payload = new TextEncoder().encode(message);
const v = JSON.parse(fs.readFileSync("./examples.json").toString());

describe("transmute", () => {
  describe("did", () => {
    describe("jwk", () => {
      describe("generate", () => {
        describe("alg", () => {
          Object.values(transmute.did.jwk.alg).forEach((alg) => {
            it(alg, async () => {
              const e = (await transmute.did.jwk.generate({
                alg,
                extractable: true,
              })) as ExportableActor;
              fixture[e.did] = e.key.privateKeyJwk;
              expect(e.did.startsWith("did:jwk:")).toBe(true);
              expect(e.key.publicKeyJwk.alg).toBe(alg);
              expect(e.key.privateKeyJwk.alg).toBe(alg);
              const ne = (await transmute.did.jwk.generate({
                alg,
                extractable: false,
              })) as IsolatedActor;
              expect(ne.did.startsWith("did:jwk:")).toBe(true);
              expect(ne.key.publicKeyJwk.alg).toBe(alg);
              expect(ne.key.privateKey).toBeDefined();
              expect((ne.key as any).privateKeyJwk).toBeUndefined();
            });
          });
        });
        afterAll(() => {
          fs.writeFileSync("./examples.json", JSON.stringify(fixture, null, 2));
        });
      });
      describe("sign & verify", () => {
        (Object.values(v) as any[]).forEach((privateKeyJwk) => {
          if ((transmute.did.jws.alg as any)[privateKeyJwk.alg]) {
            it(privateKeyJwk.alg, async () => {
              const iss = transmute.did.jwk.toDid(privateKeyJwk);
              const jws = await transmute.did.jwk.sign({
                payload,
                privateKey: privateKeyJwk,
                header: {
                  alg: privateKeyJwk.alg,
                  iss,
                  kid: `#0`,
                },
              });
              const v = await transmute.did.jwk.verify({ jws });
              expect(v.protectedHeader.alg).toBe(privateKeyJwk.alg);
              expect(new TextDecoder().decode(v.payload)).toEqual(message);
            });
          }
        });
      });

      describe("resolve & dereference", () => {
        (Object.keys(v) as Did[]).forEach((did) => {
          it(did, async () => {
            const didDocument = transmute.did.jwk.resolve({ did });
            expect(didDocument.id).toBe(did);
            const verificationMethod = await transmute.did.jwk.dereference({
              didUrl: `${did}"#0"`,
            });
            if (verificationMethod) {
              expect(verificationMethod.controller).toBe(did);
            }
          });
        });
      });
    });
  });
});
