import * as jose from "jose";

import {
  CompactJsonWebToken,
  SuccessfulVerification,
} from "../../did-jwt/types/JsonWebToken";

import { DidJwt } from "../types";
import { getKey } from "../../../util/getKey";
import { dereference } from "../../did-jwk/dereference";

export type Verify = {
  did: DidJwt;
  // issuers: string;
  // verifiers: string;
};

const getJwtVerificationKey = async (jwt: string) => {
  const decodedProtectedHeader = jose.decodeProtectedHeader(jwt) as any;
  const decodedPayload = jose.decodeJwt(jwt);
  if (decodedPayload.iss !== decodedProtectedHeader.iss) {
    console.warn("Issuer does not match.");
  }
  const vm = await dereference(
    decodedProtectedHeader.iss + decodedProtectedHeader.kid
  );
  if (!vm) {
    throw new Error(
      "Cannot find public key for issuer: " + decodedProtectedHeader.iss
    );
  }
  const key = await getKey(vm.publicKeyJwk);
  return key;
};

export const verify = async ({
  did,
}: Verify): Promise<SuccessfulVerification> => {
  const jwt = did.split(":").pop() as CompactJsonWebToken;
  const publicKey = await getJwtVerificationKey(jwt);
  const decodedPayload = jose.decodeJwt(jwt);
  const { payload, protectedHeader } = await jose.jwtVerify(jwt, publicKey, {
    issuer: decodedPayload.iss, // TODO: only dereference must be trusted.
    audience: decodedPayload.aud, // TODO: only dereference must be trusted.
  });
  return { payload, protectedHeader } as SuccessfulVerification;
};
