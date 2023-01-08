export type ExtractQueryParams<T extends string> = string extends T
  ? Record<string, string>
  : T extends `${string}:${infer Param}&${infer Rest}`
  ? { [k in Param | keyof ExtractQueryParams<Rest>]: string }
  : T extends `${string}:${infer Param}`
  ? { [k in Param]: string }
  : Record<string, never>;
