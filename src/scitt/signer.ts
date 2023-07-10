import cose from "@transmute/cose";
import { RequestCoseSinger } from './types'

export const signer = ({ privateKey }: RequestCoseSinger) => {
  return cose.detached.signer({ privateKeyJwk: privateKey })
}