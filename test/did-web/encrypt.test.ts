/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from "fs";

import transmute, { PrivateKeyJwk, VerificationMethod } from "../../src";

const examples = JSON.parse(fs.readFileSync("./examples.json").toString());
const [privateKey] = Object.values(examples).filter((jwk: any) => {
  return (
    jwk.alg === transmute.did.jwe.alg.ECDH_ES_A256KW ||
    jwk.alg === transmute.did.jwe.alg.RSA_OAEP_256
  );
}) as PrivateKeyJwk[];

const message = "It’s a dangerous business, Frodo, going out your door. 🧠💎";
const payload = new TextEncoder().encode(message);

describe("transmute", () => {
  describe("did", () => {
    describe("web", () => {
      it("encrypt and decrypt", async () => {
        const issuer = await transmute.did.web.fromPrivateKey({
          url: "https://id.gs1.org/01/9506000134352",
          privateKey,
        });
        const vm = await transmute.did.web.dereference({
          didUrl: `${issuer.did}#${privateKey.kid?.split(":").pop()}`,
          resolver: async ({ did }: any) => {
            // for test purposes.
            if (did === issuer.did) {
              return issuer.didDocument;
            }
            return null;
          },
        });
        const jwe = await transmute.encrypt({
          publicKey: (vm as VerificationMethod).publicKeyJwk,
          plaintext: payload,
          protectedHeader: {
            alg: privateKey.alg,
            enc: transmute.did.jwe.enc.A256GCM,
          },
        });
        const v = await transmute.decrypt({
          jwe,
          privateKey: privateKey,
        });
        expect(v.protectedHeader.alg).toBe(privateKey.alg);
      });
    });
  });
});
