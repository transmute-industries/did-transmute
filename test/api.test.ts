/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from "fs";
import transmute from "../src";
import { KeyAgreementAlgorithm } from "../src/did-methods/did-jwe/types/Algorithm";
import { DidUrl } from "../src/did-methods/did-jwk/types/DidDocument";
import { PrivateKeyJwk } from "../src/did-methods/did-jwk/types/JsonWebKey";
import { SignatureAlgorithm } from "../src/did-methods/did-jws/types/Algorithm";

const fixture: any = {};
const message = "It’s a dangerous business, Frodo, going out your door. 🧠💎";
const payload = new TextEncoder().encode(message);

describe("transmute", () => {
  describe("did", () => {
    describe("jwk", () => {
      describe("generate", () => {
        describe("alg", () => {
          Object.values(transmute.did.jwk.alg).forEach((alg) => {
            it(alg, async () => {
              const e: any = await transmute.did.jwk.generate({
                alg,
                extractable: true,
              });
              fixture[e.did] = e.key.privateKeyJwk;
              expect(e.did.startsWith("did:jwk:")).toBe(true);
              expect(e.key.publicKeyJwk.alg).toBe(alg);
              expect(e.key.privateKeyJwk.alg).toBe(alg);
              const ne: any = await transmute.did.jwk.generate({
                alg,
                extractable: false,
              });
              expect(ne.did.startsWith("did:jwk:")).toBe(true);
              expect(ne.key.publicKeyJwk.alg).toBe(alg);
              expect(ne.key.privateKey).toBeDefined();
              expect(ne.key.privateKeyJwk).toBeUndefined();
            });
          });
        });
        afterAll(() => {
          fs.writeFileSync("./examples.json", JSON.stringify(fixture, null, 2));
        });
      });
      describe("sign & verify", () => {
        const v: any = JSON.parse(
          fs.readFileSync("./examples.json").toString()
        );
        (Object.values(v) as PrivateKeyJwk[]).forEach((privateKeyJwk) => {
          if (transmute.did.jws.alg[privateKeyJwk.alg as SignatureAlgorithm]) {
            it(privateKeyJwk.alg, async () => {
              const iss = transmute.did.jwk.toDid(privateKeyJwk);
              const jws = await transmute.did.jwk.sign({
                payload,
                privateKey: privateKeyJwk,
                header: {
                  alg: privateKeyJwk.alg as SignatureAlgorithm,
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
      describe("encrypt & decrypt", () => {
        const v: any = JSON.parse(
          fs.readFileSync("./examples.json").toString()
        );
        (Object.values(v) as PrivateKeyJwk[]).forEach((privateKeyJwk) => {
          if (
            transmute.did.jwe.alg[privateKeyJwk.alg as KeyAgreementAlgorithm]
          ) {
            it(privateKeyJwk.alg, async () => {
              const jwe = await transmute.did.jwk.encrypt({
                plaintext: payload,
                publicKey: privateKeyJwk,
              });
              const v = await transmute.did.jwk.decrypt({
                jwe,
                privateKey: privateKeyJwk,
              });
              expect(v.protectedHeader.alg).toBe(privateKeyJwk.alg);
              expect(new TextDecoder().decode(v.plaintext)).toEqual(message);
            });
          }
        });
      });

      describe("resolve & dereference", () => {
        const v: any = JSON.parse(
          fs.readFileSync("./examples.json").toString()
        );
        (Object.keys(v) as DidUrl[]).forEach((did) => {
          it(did, async () => {
            const didDocument = transmute.did.jwk.resolve({ didUrl: did });
            expect(didDocument.id).toBe(did);
            const verificationMethod = transmute.did.jwk.dereference({
              didUrl: did + "#0",
            });
            expect(verificationMethod?.controller).toBe(did);
          });
        });
      });
    });
  });
});
