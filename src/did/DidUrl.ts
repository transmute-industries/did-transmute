import { Did, AnyDid } from "./Did";
import { ParsedDidUrl } from "./ParsedDidUrl";

export type DidUrl<D extends string> =
  `${Did<D>}${ParsedDidUrl<D>["path"]}${ParsedDidUrl<D>["query"]}${ParsedDidUrl<D>["fragment"]}`;

export type AnyDidUrl = DidUrl<AnyDid>;
