import transmute, { DidUrl } from "../src";

it("did:example:v0:123/resources/123?query=456#fragment-789", () => {
  type DidResourceId =
    DidUrl<"did:example:v0:123/resources/123?query=456#fragment-789">;
  const didUrl: DidResourceId =
    "did:example:v0:123/resources/123?query=456#fragment-789";
  const parsed = transmute.did.parse<DidResourceId>(didUrl);
  expect(parsed.method).toBe("example");
  expect(parsed.id).toBe("v0:123");
  expect(parsed.path).toBe("resources/123");
  expect(parsed.query).toBe("query=456");
  expect(parsed.fragment).toBe("fragment-789");
});

it("id", () => {
  const url = transmute.did.parse<DidUrl<"did:example:123">>("did:example:123");
  expect(url).toEqual({
    method: "example",
    id: "123",
    path: "",
    query: "",
    fragment: "",
  });
});
it("path", () => {
  const url = transmute.did.parse<DidUrl<"did:example:123/path">>(
    "did:example:123/path"
  );
  expect(url).toEqual({
    method: "example",
    id: "123",
    path: "path",
    query: "",
    fragment: "",
  });
});
it("query", () => {
  const url = transmute.did.parse<DidUrl<"did:example:123?query">>(
    "did:example:123?query"
  );
  expect(url).toEqual({
    method: "example",
    id: "123",
    path: "",
    query: "query",
    fragment: "",
  });
});
it("fragment", () => {
  const url = transmute.did.parse<DidUrl<"did:example:123#fragment">>(
    "did:example:123#fragment"
  );
  expect(url).toEqual({
    method: "example",
    id: "123",
    path: "",
    query: "",
    fragment: "fragment",
  });
});
