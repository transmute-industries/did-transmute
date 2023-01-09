import { ParsedDidUrl } from "./ParsedDidUrl";

export type Did<D extends string> =
  `did:${ParsedDidUrl<D>["method"]}:${ParsedDidUrl<D>["id"]}`;

export type AnyJoseDid =
  | Did<`did:jwk:${string}`>
  | Did<`did:jwt:${string}.${string}.${string}`>
  | Did<`did:jwt:${string}.${string}.${string}.${string}.${string}`>;

export type HttpsUrl = `https://${string}`;

export type AnyDidLike = HttpsUrl | AnyJoseDid;
