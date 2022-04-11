import { MusicFileError } from '../common/error'
import { SIGNATURES } from '../constants/signature'
import { MFSignature } from '../types/signature'

export const isValidSignature = (
  x: readonly number[] | readonly [number, number],
): x is MFSignature => {
  return SIGNATURES.some(item => item[0] === x[0] && item[1] === x[1])
}

export const ensureValidSignature = (
  x: readonly number[] | readonly [number, number],
) => {
  if (!isValidSignature(x)) {
    throw new MusicFileError(`${x} is not a valid signature`)
  }

  return x
}
