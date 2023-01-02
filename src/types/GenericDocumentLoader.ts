export type DocumentLoaderResponse = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  document: any;
};

export type GenericDocumentLoader = (
  iri: string
) => Promise<DocumentLoaderResponse>;
