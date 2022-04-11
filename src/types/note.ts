import { MFOctave } from './octave'

export type MFNote =
  | 'do'
  | 'do#'
  | 're'
  | 're#'
  | 'mi'
  | 'fa'
  | 'fa#'
  | 'sol'
  | 'sol#'
  | 'la'
  | 'la#'
  | 'ti'

export type MFOctavalNote = `${MFNote}${MFOctave}`
