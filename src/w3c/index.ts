import { signer } from "./signer"
import { verifier } from "./verifier"

import { validator } from "./validator"

import { getPublicKeyIdFromToken } from "./getPublicKeyIdFromToken"

const w3c = { signer, verifier, validator, getPublicKeyIdFromToken }

export default w3c