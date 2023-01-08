import { Did, AnyDidLike } from "../did/Did";
import { Context } from "../did/Context";
import { ExportableActor } from "../did/ExportableActor";
import { IsolatedActor } from "../did/IsolatedActor";
import { DocumentLoader } from "../did/DocumentLoader";

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

export type ExportableDidJwsJwtActor = Omit<ExportableActor<DidJwsJwt>, "key">;

export type IsolatedDidJwsJwtActor = Omit<IsolatedActor<DidJwsJwt>, "key">;

export type DidJwtResolutionProfile =
  | `embedded-jwk`
  | `relative-did-url`
  | `access_token`;

export type DidJwsJwtDocument = {
  "@context": Array<Context>;
  id: Did<DidJwsJwt>;
  [property: string]: unknown;
};

export type DidJwtResolutionParameters = {
  id: DidJwsJwt;
  documentLoader: DocumentLoader<AnyDidLike>;
  profiles: DidJwtResolutionProfile[];
};
