import { Did, AnyDid } from "../did/Did";
import { Context } from "../did/Context";
import { DidResolutionParameters } from "../did/DidResolutionParameters";
import { DidDereferenceParameters } from "../did/DidDereferenceParameters";
import { ExportableActor } from "../did/ExportableActor";
import { IsolatedActor } from "../did/IsolatedActor";

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

export type DidJwsJwtResolutionParameters = DidResolutionParameters<AnyDid> & {
  profiles: DidJwtResolutionProfile[];
};
export type DidJwkDereferenceParameters = DidDereferenceParameters<AnyDid>;

export type DidJwsJwtDocument = {
  "@context": Array<Context>;
  id: Did<DidJwsJwt>;
  [property: string]: unknown;
};

export type DidJwsJwtResolver = (
  params: DidJwsJwtResolutionParameters
) => Promise<DidJwsJwtDocument>;
