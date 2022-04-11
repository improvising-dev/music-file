import { MusicFileError } from '../common/error'
import { OCTAVE_SET } from '../constants/octave'
import { MFOctave } from '../types/octave'

export const isValidOctave = (x: number): x is MFOctave => {
  return OCTAVE_SET.has(x as MFOctave)
}

export const ensureValidOctave = (x: number) => {
  if (!isValidOctave(x)) {
    throw new MusicFileError(`${x} is not a valid ocatve`)
  }

  return x
}
