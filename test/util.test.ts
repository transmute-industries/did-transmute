import transmute from "../src";

describe("transmute", () => {
  describe("did", () => {
    describe("util", () => {
      describe("parse", () => {
        it("did", () => {
          const url = transmute.did.parse("did:example:123");
          expect(url).toEqual({
            did: "did:example:123",
            path: "",
            query: "",
            fragment: "",
          });
        });
        it("path", () => {
          const url = transmute.did.parse("did:example:123/path");
          expect(url).toEqual({
            did: "did:example:123",
            path: "path",
            query: "",
            fragment: "",
          });
        });
        it("query", () => {
          const url = transmute.did.parse("did:example:123?query");
          expect(url).toEqual({
            did: "did:example:123",
            path: "",
            query: "query",
            fragment: "",
          });
        });
        it("fragment", () => {
          const url = transmute.did.parse("did:example:123#fragment");
          expect(url).toEqual({
            did: "did:example:123",
            path: "",
            query: "",
            fragment: "fragment",
          });
        });
        it("all", () => {
          const url = transmute.did.parse(
            "did:example:123/path?query#fragment"
          );
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
});
