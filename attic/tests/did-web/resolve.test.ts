/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from "fs";

import transmute, { PrivateKeyJwk, DidDocument } from "../../src";

const examples = JSON.parse(fs.readFileSync("./examples.json").toString());
const [privateKey] = Object.values(examples).filter((jwk: any) => {
  return (transmute.did.jws.alg as any)[jwk.alg] !== undefined;
}) as PrivateKeyJwk[];

describe("transmute", () => {
  describe("did", () => {
    describe("web", () => {
      it("resolve", async () => {
        const issuer = await transmute.did.web.fromPrivateKey({
          url: "https://id.gs1.org/01/9506000134352",
          privateKey,
        });
        const didDocument = await transmute.did.web.resolve({
          did: issuer.did,
          documentLoader: async (iri: string) => {
            // for test purposes.
            if (iri === "https://id.gs1.org/01/9506000134352/did.json") {
              return { document: issuer.didDocument };
            }
            throw new Error("Unsupported IRI " + iri);
          },
        });
        expect((didDocument as DidDocument).id).toBe(issuer.did);
      });
    });
  });
});
