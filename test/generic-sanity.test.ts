import { Did, DidUrl, DidDereferenceParameters } from "../src/types/_types";

import { DocumentLoader, DidResolutionParameters } from "../src/types";

async function loader<Type>(id: Type) {
  return { document: { id, foo: 123 } };
}

async function resolve<Did>(params: DidResolutionParameters<Did>) {
  const { id, documentLoader } = params;
  const { document } = await documentLoader(id);
  return document;
}

async function dereference<DidUrl>(params: DidDereferenceParameters<DidUrl>) {
  const { id, documentLoader } = params;
  const { document } = await documentLoader(id);
  return document;
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
  type DidExample = Did<`did:example:${string}`>;
  type DidDocumentLoader = DocumentLoader<DidExample>;
  const did: DidExample = "did:example:456";
  const didDocumentLoader: DidDocumentLoader = loader;
  validateDocumentLoader(did, didDocumentLoader);
});

it("did dereferencing", async () => {
  type DidExampleUrl = DidUrl<`did:example:${string}#${string}`>;
  type DidExampleUrlDocumentLoader = DocumentLoader<DidExampleUrl>;
  const didUrl: DidExampleUrl = "did:example:456#key-456";
  const didUrlDocumentLoader: DidExampleUrlDocumentLoader = loader;
  validateDocumentLoader(didUrl, didUrlDocumentLoader);
});

it("resolve api", async () => {
  const transmute = {
    resolve,
  };
  const didDocument = await transmute.resolve({
    id: "did:example:123",
    documentLoader: loader,
  });
  expect(didDocument.id).toBe("did:example:123");
});

it("dereference api", async () => {
  const transmute = {
    dereference,
  };
  const verificationMethod = await transmute.dereference({
    id: "did:example:123#key-123",
    documentLoader: loader,
  });
  expect(verificationMethod.id).toBe("did:example:123#key-123");
});

it("multi method resolve api", async () => {
  const transmute = {
    resolve,
  };
  const didDocument1 = await transmute.resolve<Did<"did:example:123">>({
    id: "did:example:123",
    documentLoader: loader,
  });
  expect(didDocument1.id).toBe("did:example:123");
  const didDocument2 = await transmute.resolve<Did<"did:example2:123">>({
    id: "did:example2:123",
    documentLoader: loader,
  });
  expect(didDocument2.id).toBe("did:example2:123");
});
