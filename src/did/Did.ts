import { ParsedDidUrl } from "./ParsedDidUrl";

export type Did<D extends string> =
  `did:${ParsedDidUrl<D>["method"]}:${ParsedDidUrl<D>["id"]}`;

export type AnyDid = Did<`did:${string}:${string}`>;
