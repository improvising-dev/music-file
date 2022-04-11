import { MusicFileError } from '../common/error'
import { KEY_SET } from '../constants/key'
import { MFKey } from '../types/key'

export const isValidKey = (x: string): x is MFKey => {
  return KEY_SET.has(x as MFKey)
}

export const ensureValidKey = (x: string) => {
  if (!isValidKey(x)) {
    throw new MusicFileError(`${x} is not a valid key`)
  }

  return x
}
