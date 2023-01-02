/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from "fs";

import transmute, { PrivateKeyJwk } from "../../src";

const examples = JSON.parse(fs.readFileSync("./examples.json").toString());
const [privateKey] = Object.values(examples).filter((jwk: any) => {
  return (transmute.did.jws.alg as any)[jwk.alg] !== undefined;
}) as PrivateKeyJwk[];

describe("transmute", () => {
  describe("did", () => {
    describe("web", () => {
      it("fromPrivateKey", async () => {
        const issuer = await transmute.did.web.fromPrivateKey({
          url: "https://id.gs1.org/01/9506000134352",
          privateKey,
        });
        expect(issuer.did).toBe("did:web:id.gs1.org:01:9506000134352");
        expect(issuer.didDocument).toBeDefined();
      });
    });
  });
});
