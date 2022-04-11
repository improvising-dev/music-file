import { MFKey } from '../types/key'

export const KEYS: readonly MFKey[] = [
  'C',
  'D',
  'E',
  'F',
  'G',
  'A',
  'B',
  'C#',
  'Cb',
  'Db',
  'Eb',
  'F#',
  'Gb',
  'Ab',
  'Bb',
] as const

export const KEY_SET = new Set<MFKey>(KEYS)
