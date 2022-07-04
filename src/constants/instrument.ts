import { MFInstrument } from '../types/instrument'

export const INSTRUMENTS: readonly MFInstrument[] = [
  'Piano',
  'Keyboard',
  'Bell',
  'Organ',
  'Harmonica',
  'Guitar',
  'Bass',
  'Violin',
  'Viola',
  'Cello',
  'Strings',
  'Brass',
  'Piccolo',
  'Flute',
  'Lead',
  'Pad',
] as const

export const INSTRUMENT_SET = new Set<MFInstrument>(INSTRUMENTS)
