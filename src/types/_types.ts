export type DocumentLoaderResponse<ResolvableDocument> = {
  document: ResolvableDocument;
};

export type DocumentLoaderDocument<Identifier> = {
  id: Identifier;
  [property: string]: unknown;
};

export type AsyncDocumentLoader<Identifier, ResolvableDocument> = (
  id: Identifier
) => Promise<DocumentLoaderResponse<ResolvableDocument>>;

export type DocumentLoader<Identifier> = AsyncDocumentLoader<
  Identifier,
  DocumentLoaderDocument<Identifier>
>;

export type Split<S extends string, D extends string> = string extends S
  ? string[]
  : S extends ""
  ? []
  : S extends `${infer T}${D}${infer U}`
  ? [T, ...Split<U, D>]
  : [S];

export type DidFragment<S extends string> =
  S extends `${string}#${infer Fragment}` ? `#${Fragment}` : "";

export type DidQuery<S extends string> = S extends `${string}?${infer Query}`
  ? `?${Query}`
  : "";

export type DidPath<S extends string> = S extends `${string}/${infer Path}`
  ? `/${Path}`
  : "";

export type DidMethod<S extends string> =
  S extends `did:${infer Method}:${string}` ? Method : "";

export type DidMethodId<S extends string> =
  S extends `did:${string}:${infer Id}`
    ? Split<Split<Split<Id, "/">[0], "?">[0], "#">[0]
    : "";

export type ParsedDidUrl<S extends string> = {
  method: DidMethod<S>;
  id: DidMethodId<S>;
  path: DidPath<Split<Split<S, "#">[0], "?">[0]>;
  query: DidQuery<Split<S, "#">[0]>;
  fragment: DidFragment<S>;
};

export type Did<D extends string> =
  `did:${ParsedDidUrl<D>["method"]}:${ParsedDidUrl<D>["id"]}`;

export type DidUrl<D extends string> =
  `${Did<D>}${ParsedDidUrl<D>["path"]}${ParsedDidUrl<D>["query"]}${ParsedDidUrl<D>["fragment"]}`;

export type ExtractPathParams<T extends string> = string extends T
  ? Record<string, string>
  : T extends `${string}:${infer Param}/${infer Rest}`
  ? { [k in Param | keyof ExtractPathParams<Rest>]: string }
  : T extends `${string}:${infer Param}`
  ? { [k in Param]: string }
  : Record<string, never>;

export type ExtractQueryParams<T extends string> = string extends T
  ? Record<string, string>
  : T extends `${string}:${infer Param}&${infer Rest}`
  ? { [k in Param | keyof ExtractQueryParams<Rest>]: string }
  : T extends `${string}:${infer Param}`
  ? { [k in Param]: string }
  : Record<string, never>;

export type ExtractFragmentParams<T extends string> = string extends T
  ? Record<string, string>
  : T extends `${string}:${infer Param}/${infer Rest}`
  ? { [k in Param | keyof ExtractFragmentParams<Rest>]: string }
  : T extends `${string}:${infer Param}`
  ? { [k in Param]: string }
  : Record<string, never>;

export type ResourceParams<S extends string> = {
  id: `did:${ParsedDidUrl<S>["method"]}:${ParsedDidUrl<S>["id"]}`;
  path: ExtractPathParams<ParsedDidUrl<S>["path"]>;
  query: ExtractQueryParams<ParsedDidUrl<S>["query"]>;
  fragment: ExtractFragmentParams<ParsedDidUrl<S>["fragment"]>;
};

export type DidResolutionParameters<Did> = {
  id: Did;
  documentLoader: DocumentLoader<Did>;
};

export type DidDereferenceParameters<DidUrl> = {
  id: DidUrl;
  documentLoader: DocumentLoader<DidUrl>;
};

// type E0 =
//   ParsedDidUrl<"did:example:v0:123/resources/123?query=456#fragment-789">;
// type E1 = ParsedDidUrl<"did:example:v0:123/resources/123#fragment-789">;
// type E2 = ParsedDidUrl<"did:example:v0:123?query=456#fragment-789">;
// type E3 = ParsedDidUrl<"did:example:v0:123#fragment-789">;
// type E4 = ParsedDidUrl<"did:example:v0:123?query=456">;
// type E5 = ParsedDidUrl<"did:example:v0:123/resources/123">;
// type E6 = ParsedDidUrl<"did:example:v0:123/resources/123">;

// type R0 = DidUrl<"did:example:v0:123/resources/123?query=456#fragment-789">;
// type R1 = DidUrl<"did:example:v0:123/resources/123">;
// type R2 = DidUrl<"did:example:v0:123#fragment-789">;

// type R0P =
//   ResourceParams<"did:example:v0:123/posts/:postId/:commentId?authUser=:authUser&filter=:filter#:keyId">;
