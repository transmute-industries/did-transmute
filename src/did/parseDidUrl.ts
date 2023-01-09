import { ParsedDidUrl, RemovePrefix } from "./ParsedDidUrl";

export function parseDidUrl<ID extends string>(id: ID) {
  const pathStartsAt = id.indexOf("/");
  const queryStartsAt = id.indexOf("?");
  const fragmentStartsAt = id.indexOf("#");
  const fragment =
    fragmentStartsAt === -1
      ? ""
      : id.substring(fragmentStartsAt + 1, id.length);

  const query =
    queryStartsAt === -1
      ? ""
      : id.substring(
          queryStartsAt + 1,
          fragmentStartsAt > -1 ? fragmentStartsAt : id.length
        );
  const path =
    pathStartsAt === -1
      ? ""
      : id.substring(
          pathStartsAt + 1,
          queryStartsAt > -1
            ? queryStartsAt
            : fragmentStartsAt > -1
            ? fragmentStartsAt
            : id.length
        );
  const did = id
    .replace("/" + path, "")
    .replace("?" + query, "")
    .replace("#" + fragment, "");

  const method = did.split(":")[1];
  const methodSpecificId = did.replace(`did:${method}:`, "");

  return {
    method: method as ParsedDidUrl<ID>["method"],
    id: methodSpecificId as ParsedDidUrl<ID>["id"],
    path: path as RemovePrefix<"/", ParsedDidUrl<ID>["path"]>,
    query: query as RemovePrefix<"?", ParsedDidUrl<ID>["query"]>,
    fragment: fragment as RemovePrefix<"#", ParsedDidUrl<ID>["fragment"]>,
  };
}
