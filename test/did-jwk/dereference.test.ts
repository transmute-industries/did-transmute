/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from "fs";
import transmute, { DidJwk, VerificationMethod } from "../../src";

const examples = JSON.parse(fs.readFileSync("./examples.json").toString());

const [did] = Object.keys(examples) as DidJwk[];

describe("transmute", () => {
  describe("did", () => {
    describe("jwk", () => {
      describe("dereference", () => {
        it(did, async () => {
          const verificationMethod = await transmute.did.jwk.dereference({
            didUrl: `${did}#0`,
            resolver: transmute.did.jwk.resolve,
          });
          if (verificationMethod) {
            expect((verificationMethod as VerificationMethod).controller).toBe(
              did
            );
          }
        });
      });
    });
  });
});
