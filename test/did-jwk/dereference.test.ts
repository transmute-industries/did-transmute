/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from "fs";
import transmute, { Did } from "../../src";

const examples = JSON.parse(fs.readFileSync("./examples.json").toString());

const [did] = Object.keys(examples) as Did[];

describe("transmute", () => {
  describe("did", () => {
    describe("jwk", () => {
      describe("dereference", () => {
        it(did, async () => {
          const verificationMethod = await transmute.did.jwk.dereference({
            didUrl: `${did}#0`,
          });
          if (verificationMethod) {
            expect(verificationMethod.controller).toBe(did);
          }
        });
      });
    });
  });
});
