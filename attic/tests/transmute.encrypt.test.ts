/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from "fs";
import transmute, { PrivateKeyJwk } from "../src";

const message = "It’s a dangerous business, Frodo, going out your door. 🧠💎";
const payload = new TextEncoder().encode(message);
const examples = JSON.parse(fs.readFileSync("./examples.json").toString());

const encryptableKeys = Object.values(examples).filter((jwk: any) => {
  return (
    jwk.alg === transmute.did.jwe.alg.ECDH_ES_A256KW ||
    jwk.alg === transmute.did.jwe.alg.RSA_OAEP_256
  );
}) as PrivateKeyJwk[];

describe("transmute", () => {
  describe("encrypt & decrypt", () => {
    encryptableKeys.forEach((privateKeyJwk) => {
      it(privateKeyJwk.alg, async () => {
        const jwe = await transmute.encrypt({
          publicKey: privateKeyJwk,
          plaintext: payload,
          protectedHeader: {
            alg: privateKeyJwk.alg,
            enc: transmute.did.jwe.enc.A256GCM,
          },
        });
        const v = await transmute.decrypt({
          jwe,
          privateKey: privateKeyJwk,
        });
        expect(v.protectedHeader.alg).toBe(privateKeyJwk.alg);
        expect(new TextDecoder().decode(v.plaintext)).toEqual(message);
      });
    });
  });
});
