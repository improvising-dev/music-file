import { MusicFileError } from '../common/error'
import { INSTRUMENT_SET } from '../constants/instrument'
import { MFInstrument } from '../types/instrument'

export const isValidInstrument = (x: string): x is MFInstrument => {
  return INSTRUMENT_SET.has(x as MFInstrument)
}

export const ensureValidInstrument = (x: string) => {
  if (!isValidInstrument(x)) {
    throw new MusicFileError(`${x} is not a valid instrument`)
  }

  return x
}
