/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from "fs";
import transmute, { Did } from "../../src";

const examples = JSON.parse(fs.readFileSync("./examples.json").toString());

const [did] = Object.keys(examples) as Did[];

describe("transmute", () => {
  describe("did", () => {
    describe("jwk", () => {
      describe("resolve", () => {
        it(did, async () => {
          const didDocument = (await transmute.did.jwk.resolve({ did })) as any;
          const didDocument2 = (await transmute.did.jwk.resolve({
            did: `${did}#key-not-here...`,
          })) as any;
          const didDocument3 = (await transmute.did.jwk.dereference({
            didUrl: `${did}`,
            resolver: transmute.did.jwk.resolve,
          })) as any;
          expect(didDocument.id).toBe(did);
          expect(didDocument2).toEqual(didDocument);
          expect(didDocument3).toEqual(didDocument);
        });
      });
    });
  });
});
