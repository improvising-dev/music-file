import { MFOctave } from '../types/octave'

export const OCTAVES: readonly MFOctave[] = [1, 2, 3, 4, 5, 6, 7] as const

export const OCTAVE_SET = new Set<MFOctave>(OCTAVES)
