import { PrivateKeyJwk } from "../types";

export type PrivateKeyLoader = (id: string) => Promise<PrivateKeyJwk>;
