/* eslint-disable @typescript-eslint/no-explicit-any */

import transmute, { DidDocument, ExportableKey } from "../../src";
import { DidWeb } from "../../src/types/DidWeb";

describe("transmute", () => {
  describe("did", () => {
    describe("web", () => {
      it("generate", async () => {
        const { did, didDocument, key } = (await transmute.did.web.exportable({
          url: "https://id.gs1.org/01/9506000134352",
          alg: transmute.did.jws.alg.ES256,
          resolver: transmute.did.jwk.resolve,
        })) as { did: DidWeb; didDocument: DidDocument; key: ExportableKey };
        expect(did).toBe("did:web:id.gs1.org:01:9506000134352");
        expect(didDocument.id).toBe(did);
        expect(key.publicKeyJwk.alg).toBe(transmute.did.jws.alg.ES256);
      });
    });
  });
});
