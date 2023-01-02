/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from "fs";

import transmute, {
  PrivateKeyJwk,
  DidDocument,
  VerificationMethod,
} from "../../src";
import { DidWeb } from "../../src/types/DidWeb";

const examples = JSON.parse(fs.readFileSync("./examples.json").toString());

const verificationKeys = Object.values(examples).filter((jwk: any) => {
  return (transmute.did.jws.alg as any)[jwk.alg] !== undefined;
}) as PrivateKeyJwk[];

const privateKey = verificationKeys[0];

const getActor = async (
  url: string,
  privateKey: PrivateKeyJwk
): Promise<{ did: DidWeb; didDocument: DidDocument }> => {
  const { did, didDocument } = await transmute.did.web.from({
    url,
    dids: [transmute.did.jwk.toDid(privateKey)],
    resolver: transmute.did.jwk.resolve,
  });
  return { did, didDocument } as {
    did: DidWeb;
    didDocument: DidDocument;
  };
};

const message = "It’s a dangerous business, Frodo, going out your door. 🧠💎";
const payload = new TextEncoder().encode(message);
describe("transmute", () => {
  describe("did", () => {
    describe("web", () => {
      it("sign and verify", async () => {
        const issuer = await getActor(
          "https://id.gs1.org/01/9506000134352",
          privateKey
        );
        const jws = await transmute.sign({
          payload,
          protectedHeader: {
            alg: privateKey.alg,
          },
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
        const v = await transmute.verify({
          jws,
          publicKey: (vm as VerificationMethod).publicKeyJwk,
        });
        expect(v.protectedHeader.alg).toBe(privateKey.alg);
      });
    });
  });
});
