import * as jose from "jose";
import { SignatureAlgorithm } from "../../did-jws/types/Algorithm";
export type EncodedProtectedHeader = string;
export type EncodedPayload = string;
export type EncodedSignature = string;

export type CompactJsonWebToken =
  `${EncodedProtectedHeader}.${EncodedPayload}.${EncodedSignature}`;

export type ProtectedHeader = {
  alg: SignatureAlgorithm;
  iss: string;
  kid: string;
  cty: string;
  enc: string; // fix me
  [x: string]: unknown;
};

export type SuccessfulVerification = {
  payload: jose.JWTPayload;
  protectedHeader: jose.JWTHeaderParameters;
};
