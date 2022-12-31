import { Did } from "./Did";

export type DidPath = "" | `/${string}`;
export type DidQuery = "" | `?${string}`;
export type DidFragment = "" | `#${string}`;

export type DidUrl = `${Did}${DidPath}${DidQuery}${DidFragment}`;

export type DidUrlObject = {
  did: Did;
  path: DidPath;
  query: DidQuery;
  fragment: DidFragment;
};
