import { DidUrl } from "./DidUrl";
import { Resolver } from "./Resolver";

export type DereferenceParameters = {
  didUrl: DidUrl;
  resolver: Resolver;
};
