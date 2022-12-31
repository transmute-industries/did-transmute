import { Did } from "../types/Did";
import {
  DidFragment,
  DidPath,
  DidQuery,
  DidUrl,
  DidUrlObject,
} from "../types/DidUrl";

export const parseDidUrl = (didUrl: DidUrl): DidUrlObject => {
  const pathStartsAt = didUrl.indexOf("/");
  const queryStartsAt = didUrl.indexOf("?");
  const fragmentStartsAt = didUrl.indexOf("#");
  const fragment =
    fragmentStartsAt === -1
      ? ""
      : didUrl.substring(fragmentStartsAt + 1, didUrl.length);

  const query =
    queryStartsAt === -1
      ? ""
      : didUrl.substring(
          queryStartsAt + 1,
          fragmentStartsAt > -1 ? fragmentStartsAt : didUrl.length
        );
  const path =
    pathStartsAt === -1
      ? ""
      : didUrl.substring(
          pathStartsAt + 1,
          queryStartsAt > -1
            ? queryStartsAt
            : fragmentStartsAt > -1
            ? fragmentStartsAt
            : didUrl.length
        );
  const did = didUrl
    .replace("/" + path, "")
    .replace("?" + query, "")
    .replace("#" + fragment, "");
  return {
    did: did as Did,
    path: path as DidPath,
    query: query as DidQuery,
    fragment: fragment as DidFragment,
  };
};
