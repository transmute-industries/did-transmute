type DocumentLoaderResponse<ResolvableDocument> = {
  document: ResolvableDocument;
};

type DocumentLoaderDocument<Identifier> = {
  id: Identifier;
  [property: string]: unknown;
};

type AsyncDocumentLoader<Identifier, ResolvableDocument> = (
  id: Identifier
) => Promise<DocumentLoaderResponse<ResolvableDocument>>;

type DocumentLoader<Identifier> = AsyncDocumentLoader<
  Identifier,
  DocumentLoaderDocument<Identifier>
>;

type Split<S extends string, D extends string> = string extends S
  ? string[]
  : S extends ""
  ? []
  : S extends `${infer T}${D}${infer U}`
  ? [T, ...Split<U, D>]
  : [S];

type DidFragment<S extends string> = S extends `${string}#${infer Fragment}`
  ? `#${Fragment}`
  : "";

type DidQuery<S extends string> = S extends `${string}?${infer Query}`
  ? `?${Query}`
  : "";

type DidPath<S extends string> = S extends `${string}/${infer Path}`
  ? `/${Path}`
  : "";

type DidMethod<S extends string> = S extends `did:${infer Method}:${string}`
  ? Method
  : "";

type DidMethodId<S extends string> = S extends `did:${string}:${infer Id}`
  ? Split<Split<Split<Id, "/">[0], "?">[0], "#">[0]
  : "";

type DidUrl<S extends string> = {
  method: DidMethod<S>;
  id: DidMethodId<S>;
  path: DidPath<Split<Split<S, "#">[0], "?">[0]>;
  query: DidQuery<Split<S, "#">[0]>;
  fragment: DidFragment<S>;
};

type DidResourceId<D extends string> =
  `did:${DidUrl<D>["method"]}:${DidUrl<D>["id"]}${DidUrl<D>["path"]}${DidUrl<D>["query"]}${DidUrl<D>["fragment"]}`;

type Did<D extends string> = `did:${DidUrl<D>["method"]}:${DidUrl<D>["id"]}`;

type ExtractPathParams<T extends string> = string extends T
  ? Record<string, string>
  : T extends `${string}:${infer Param}/${infer Rest}`
  ? { [k in Param | keyof ExtractPathParams<Rest>]: string }
  : T extends `${string}:${infer Param}`
  ? { [k in Param]: string }
  : Record<string, never>;

type ExtractQueryParams<T extends string> = string extends T
  ? Record<string, string>
  : T extends `${string}:${infer Param}&${infer Rest}`
  ? { [k in Param | keyof ExtractQueryParams<Rest>]: string }
  : T extends `${string}:${infer Param}`
  ? { [k in Param]: string }
  : Record<string, never>;

type ExtractFragmentParams<T extends string> = string extends T
  ? Record<string, string>
  : T extends `${string}:${infer Param}/${infer Rest}`
  ? { [k in Param | keyof ExtractFragmentParams<Rest>]: string }
  : T extends `${string}:${infer Param}`
  ? { [k in Param]: string }
  : Record<string, never>;

type ResourceParams<S extends string> = {
  id: `did:${DidUrl<S>["method"]}:${DidUrl<S>["id"]}`;
  path: ExtractPathParams<DidUrl<S>["path"]>;
  query: ExtractQueryParams<DidUrl<S>["query"]>;
  fragment: ExtractFragmentParams<DidUrl<S>["fragment"]>;
};

type E0 = DidUrl<"did:example:v0:123/resources/123?query=456#fragment-789">;
type E1 = DidUrl<"did:example:v0:123/resources/123#fragment-789">;
type E2 = DidUrl<"did:example:v0:123?query=456#fragment-789">;
type E3 = DidUrl<"did:example:v0:123#fragment-789">;
type E4 = DidUrl<"did:example:v0:123?query=456">;
type E5 = DidUrl<"did:example:v0:123/resources/123">;
type E6 = DidUrl<"did:example:v0:123/resources/123">;

type R0 =
  DidResourceId<"did:example:v0:123/resources/123?query=456#fragment-789">;
type R1 = DidResourceId<"did:example:v0:123/resources/123">;
type R2 = DidResourceId<"did:example:v0:123#fragment-789">;

type R0P =
  ResourceParams<"did:example:v0:123/posts/:postId/:commentId?authUser=:authUser&filter=:filter#:keyId">;

async function loader<Type>(id: Type) {
  return { document: { id, foo: 123 } };
}

async function validateDocumentLoader<Identifier>(
  someId: Identifier,
  someDocumentLoader: DocumentLoader<Identifier>
) {
  const someResolvedDocument = await someDocumentLoader(someId);
  const someDidExampleId = someResolvedDocument.document.id;
  expect(someDidExampleId).toBe(someId);
}

it("url resolution", async () => {
  type HttpsUrl = `https://${string}`;
  type HttpsDocumentLoader = DocumentLoader<HttpsUrl>;
  const httpsUrl: HttpsUrl = "https://vendor.example";
  const httpsDocumentLoader: HttpsDocumentLoader = loader;
  validateDocumentLoader(httpsUrl, httpsDocumentLoader);
});

it("did resolution", async () => {
  type DidUrl = Did<`did:example:${string}`>;
  type DidDocumentLoader = DocumentLoader<DidUrl>;
  const didUrl: DidUrl = "did:example:456";
  const didUrlDocumentLoader: DidDocumentLoader = loader;
  validateDocumentLoader(didUrl, didUrlDocumentLoader);
});

it("did dereferencing", async () => {
  type DidUrl = DidResourceId<`did:example:${string}#${string}`>;
  type DidDocumentLoader = DocumentLoader<DidUrl>;
  const didUrl: DidUrl = "did:example:456#key-456";
  const didUrlDocumentLoader: DidDocumentLoader = loader;
  validateDocumentLoader(didUrl, didUrlDocumentLoader);
});
