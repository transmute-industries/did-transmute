import { Did } from "../did/Did";
// import { DidUrl } from "../did/DidUrl";
import { Context } from "../did/Context";
// import { ParsedDidUrl } from "../did/ParsedDidUrl";
import { DidResolutionParameters } from "../did/DidResolutionParameters";
// import { DidDereferenceParameters } from "../did/DidDereferenceParameters";
// import { VerificationMethod } from "../did/VerificationMethod";

// export type JwsJwt =

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

export type DidJwsJwtResolutionParameters = DidResolutionParameters<DidJwsJwt>;
// export type DidJwkDereferenceParameters = DidDereferenceParameters<DidJwkUrl>;

export type DidJwsJwtDocument = {
  "@context": Array<Context>;
  id: Did<DidJwsJwt>;
  [property: string]: unknown;
};

export type DidJwsJwtResolver = (
  params: DidJwsJwtResolutionParameters
) => Promise<DidJwsJwtDocument>;
