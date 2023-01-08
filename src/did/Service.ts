import { AnyDidUrl } from "./DidUrl";
import { ParsedDidUrl } from "./ParsedDidUrl";

export type Service<U extends string> = {
  id: ParsedDidUrl<U>["fragment"];
  type: string;
  serviceEndpoint: string | string[];
};

export type AnyService = Service<AnyDidUrl>;
