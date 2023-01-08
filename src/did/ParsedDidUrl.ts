import { Split } from "../types/Split";

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

export type RemovePrefix<
  P extends string,
  S extends string
> = S extends `${P}${infer WithoutP}` ? WithoutP : S;
