import { SignatureAlgorithm } from "../../did-jws/types/Algorithm";
import { KeyAgreementAlgorithm } from "../../did-jwe/types/Algorithm";

export type Algorithm = SignatureAlgorithm | KeyAgreementAlgorithm;
