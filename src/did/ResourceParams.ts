import { ParsedDidUrl } from "./ParsedDidUrl";
import { ExtractPathParams } from "./ExtractPathParams";
import { ExtractQueryParams } from "./ExtractQueryParams";
import { ExtractFragmentParams } from "./ExtractFragmentParams";

export type ResourceParams<S extends string> = {
  id: `did:${ParsedDidUrl<S>["method"]}:${ParsedDidUrl<S>["id"]}`;
  path: ExtractPathParams<ParsedDidUrl<S>["path"]>;
  query: ExtractQueryParams<ParsedDidUrl<S>["query"]>;
  fragment: ExtractFragmentParams<ParsedDidUrl<S>["fragment"]>;
};
