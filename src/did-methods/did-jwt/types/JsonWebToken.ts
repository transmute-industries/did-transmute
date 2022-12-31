import * as jose from "jose";
import { KeyAgreementAlgorithm } from "../../../types";
import { SignatureAlgorithm } from "../../did-jws/types/Algorithm";
export type EncodedProtectedHeader = string;
export type EncodedPayload = string;
export type EncodedSignature = string;

export type CompactJsonWebToken =
  `${EncodedProtectedHeader}.${EncodedPayload}.${EncodedSignature}`;

export type ProtectedHeader = jose.JWTHeaderParameters & {
  alg: SignatureAlgorithm | KeyAgreementAlgorithm;
  iss: string;
  kid: string;
  cty: string;
  [x: string]: unknown;
};

export type ClaimSet = jose.JWTPayload & {
  [x: string]: unknown;
};

export type SuccessfulVerification = {
  payload: jose.JWTPayload;
  protectedHeader: jose.JWTHeaderParameters;
};
