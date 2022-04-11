import { MFInstrument } from '../types/instrument'

export const DEFAULT_INSTRUMENT: MFInstrument = 'Piano' as const

export const INSTRUMENTS: readonly MFInstrument[] = [
  'Piano',
  'Organ',
  'Guitar',
  'Bass',
  'Violin',
  'Viola',
  'Cello',
  'Strings',
  'Sax',
  'Piccolo',
  'Flute',
  'Lead',
  'Pad',
  'Drumset',
] as const

export const INSTRUMENT_SET = new Set<MFInstrument>(INSTRUMENTS)
