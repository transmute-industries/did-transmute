import did from "./did-methods";

import { encryptToKey, decryptWithKey } from "./jose";

const transmute = { did, encrypt: encryptToKey, decrypt: decryptWithKey };

export * from "./types";

export default transmute;
