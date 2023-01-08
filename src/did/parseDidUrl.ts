import { ParsedDidUrl, RemovePrefix } from "./ParsedDidUrl";
import { DidUrl } from "./DidUrl";

export function parseDidUrl<DidUrlType extends string>(id: DidUrl<DidUrlType>) {
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
    method: method as ParsedDidUrl<DidUrlType>["method"],
    id: methodSpecificId as ParsedDidUrl<DidUrlType>["id"],
    path: path as RemovePrefix<"/", ParsedDidUrl<DidUrlType>["path"]>,
    query: query as RemovePrefix<"?", ParsedDidUrl<DidUrlType>["query"]>,
    fragment: fragment as RemovePrefix<
      "#",
      ParsedDidUrl<DidUrlType>["fragment"]
    >,
  };
}
