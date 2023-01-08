export type DocumentLoaderResponse<ResolvableDocument> = {
  document: ResolvableDocument;
};
type AsyncDocumentLoader<Identifier, ResolvableDocument> = (
  id: Identifier
) => Promise<DocumentLoaderResponse<ResolvableDocument>>;

export type DocumentLoaderDocument<Identifier> = {
  id: Identifier;
  [property: string]: unknown;
};

export type DocumentLoader<Identifier> = AsyncDocumentLoader<
  Identifier,
  DocumentLoaderDocument<Identifier>
>;
