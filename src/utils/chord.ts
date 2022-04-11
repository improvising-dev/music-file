import { MusicFileError } from '../common/error'
import { CHORD_SET } from '../constants/chord'
import { MFChord } from '../types/chord'

export const isValidChord = (x: string): x is MFChord => {
  return CHORD_SET.has(x as MFChord)
}

export const ensureValidChord = (x: string) => {
  if (!isValidChord(x)) {
    throw new MusicFileError(`${x} is not a valid chord`)
  }

  return x
}
