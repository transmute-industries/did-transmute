/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from "fs";
import transmute, { PrivateKeyJwk } from "../src";

const message = "It’s a dangerous business, Frodo, going out your door. 🧠💎";
const payload = new TextEncoder().encode(message);
const examples = JSON.parse(fs.readFileSync("./examples.json").toString());

const verificationKeys = Object.values(examples).filter((jwk: any) => {
  return (transmute.did.jws.alg as any)[jwk.alg] !== undefined;
}) as PrivateKeyJwk[];

describe("transmute", () => {
  describe("sign & verify", () => {
    verificationKeys.forEach((privateKeyJwk) => {
      it(privateKeyJwk.alg, async () => {
        const jws = await transmute.sign({
          privateKey: privateKeyJwk,
          protectedHeader: {
            alg: privateKeyJwk.alg,
          },
          payload: payload,
        });
        const v = await transmute.verify({
          jws,
          publicKey: privateKeyJwk,
        });
        expect(v.protectedHeader.alg).toBe(privateKeyJwk.alg);
        expect(new TextDecoder().decode(v.payload)).toEqual(message);
      });
    });
  });
});
