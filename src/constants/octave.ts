import { MFOctave } from '../types/octave'

export const OCTAVES: readonly MFOctave[] = [1, 2, 3, 4, 5, 6, 7] as const

export const OCTAVE_SET = new Set<MFOctave>(OCTAVES)

export const MIN_OCTAVE = OCTAVES[0]
export const MAX_OCTAVE = OCTAVES[OCTAVES.length - 1]
