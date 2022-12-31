import transmute, { DidUrl } from "../src";

describe("transmute", () => {
  describe("did", () => {
    describe("util", () => {
      it("parse", () => {
        const didUrl: DidUrl = "did:example:123/path?query#fragment";
        const url = transmute.did.parse(didUrl);
        expect(url).toEqual({
          did: "did:example:123",
          path: "path",
          query: "query",
          fragment: "fragment",
        });
      });
    });
  });
});
