import { DidUrl } from "./DidUrl";

export type Service = {
  id: DidUrl;
  type: string;
  serviceEndpoint: string | string[];
};
