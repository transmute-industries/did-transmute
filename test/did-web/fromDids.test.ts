/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from "fs";

import transmute, { DidJwk } from "../../src";

const examples = JSON.parse(fs.readFileSync("./examples.json").toString());

describe("transmute", () => {
  describe("did", () => {
    describe("web", () => {
      it("fromDids", async () => {
        const issuer = await transmute.did.web.fromDids({
          url: "https://id.gs1.org/01/9506000134352",
          dids: Object.keys(examples) as DidJwk[],
          resolver: transmute.did.jwk.resolve,
        });
        expect(issuer.did).toBe("did:web:id.gs1.org:01:9506000134352");
        expect(issuer.didDocument).toBeDefined();
        expect(issuer.didDocument.verificationMethod?.length).toBe(
          Object.keys(examples).length
        );
      });
    });
  });
});
