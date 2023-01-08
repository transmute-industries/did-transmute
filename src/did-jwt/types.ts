import { Did, AnyDidLike } from "../did/Did";
import { Context } from "../did/Context";
import { ExportableActor } from "../did/ExportableActor";
import { IsolatedActor } from "../did/IsolatedActor";
import { DocumentLoader } from "../did/DocumentLoader";
import { PrivateKeyLoader } from "../did/PrivateKeyLoader";

export type EncodedJws<U extends string> =
  U extends `${infer EncodedProtectedHeader}.${infer EncodedPayload}.${infer EncodedSignature}`
    ? {
        protectedHeader: EncodedProtectedHeader;
        payload: EncodedPayload;
        signature: EncodedSignature;
      }
    : { protectedHeader: ""; payload: ""; signature: "" };

export type CompactJws<U extends string> =
  `${EncodedJws<U>["protectedHeader"]}.${EncodedJws<U>["payload"]}.${EncodedJws<U>["signature"]}`;

export type DidJwsJwt =
  Did<`did:jwt:${CompactJws<`${string}.${string}.${string}`>}`>;

export type EncodedJwe<U extends string> =
  U extends `${infer EncodedProtectedHeader}.${infer EncryptedKey}.${infer InitializationVector}.${infer CypherText}.${infer AuthenticationTag}`
    ? {
        protectedHeader: EncodedProtectedHeader;
        encryptedKey: EncryptedKey;
        initializationVector: InitializationVector;
        cypherText: CypherText;
        authenticationTag: AuthenticationTag;
      }
    : {
        protectedHeader: "";
        encryptedKey: "";
        initializationVector: "";
        cypherText: "";
        authenticationTag: "";
      };

export type CompactJwe<U extends string> =
  `${EncodedJwe<U>["protectedHeader"]}.${EncodedJwe<U>["encryptedKey"]}.${EncodedJwe<U>["initializationVector"]}.${EncodedJwe<U>["cypherText"]}.${EncodedJwe<U>["authenticationTag"]}`;

export type DidJweJwt =
  Did<`did:jwt:${CompactJwe<`${string}.${string}.${string}.${string}.${string}`>}`>;

export type ExportableDidJwsJwtActor = Omit<ExportableActor<DidJwsJwt>, "key">;

export type IsolatedDidJwsJwtActor = Omit<IsolatedActor<DidJwsJwt>, "key">;

export type ExportableDidJweJwtActor = Omit<ExportableActor<DidJweJwt>, "key">;

export type DidJwtResolutionProfile =
  | `embedded-jwk`
  | `relative-did-url`
  | `access_token`
  | `encrypted-jwt`;

export type DidJwsJwtDocument = {
  "@context": Array<Context>;
  id: Did<DidJwsJwt>;
  [property: string]: unknown;
};

export interface DidResolutionParameters {
  id: DidJwsJwt | DidJweJwt;
  profiles: DidJwtResolutionProfile[];
}

export interface DidJwsJwtResolutionParameters extends DidResolutionParameters {
  id: DidJwsJwt;
  documentLoader: DocumentLoader<AnyDidLike>;
}

export interface DidJweJwtResolutionParameters extends DidResolutionParameters {
  id: DidJweJwt;
  privateKeyLoader: PrivateKeyLoader;
}

export type DidJwtDocument = {
  "@context": Array<Context>;
  id: Did<`did:jwt:${string}`>;
  [property: string]: unknown;
};
