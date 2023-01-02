/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from "fs";

import transmute, { PrivateKeyJwk, VerificationMethod } from "../../src";
import { DidWebUrl } from "../../src/types/DidWeb";

const examples = JSON.parse(fs.readFileSync("./examples.json").toString());
const [privateKey] = Object.values(examples).filter((jwk: any) => {
  return (transmute.did.jws.alg as any)[jwk.alg] !== undefined;
}) as PrivateKeyJwk[];

const message = "It’s a dangerous business, Frodo, going out your door. 🧠💎";
const payload = new TextEncoder().encode(message);
describe("transmute", () => {
  describe("did", () => {
    describe("web", () => {
      it("sign and verify", async () => {
        const issuer = await transmute.did.web.fromPrivateKey({
          url: "https://id.gs1.org/01/9506000134352",
          privateKey,
        });
        const jws = await transmute.sign({
          payload,
          protectedHeader: {
            alg: privateKey.alg,
          },
          privateKey,
        });
        const absoluteDidWebUrl = `${issuer.did}#${privateKey.kid
          ?.split(":")
          .pop()}`;
        const vm = await transmute.did.web.dereference({
          didUrl: absoluteDidWebUrl as DidWebUrl,
          resolver: async ({ did }) => {
            // for test purposes.
            if (did === issuer.did) {
              return issuer.didDocument;
            }
            return null;
          },
        });
        const v = await transmute.verify({
          jws,
          publicKey: (vm as VerificationMethod).publicKeyJwk,
        });
        expect(v.protectedHeader.alg).toBe(privateKey.alg);
      });
    });
  });
});
