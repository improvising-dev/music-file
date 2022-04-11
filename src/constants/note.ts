import { MFNote, MFOctavalNote } from '../types/note'
import { OCTAVES } from './octave'

export const NOTES: readonly MFNote[] = [
  'do',
  'do#',
  're',
  're#',
  'mi',
  'fa',
  'fa#',
  'sol',
  'sol#',
  'la',
  'la#',
  'ti',
] as const

export const NOTE_SET = new Set<MFNote>(NOTES)

export const OCTAVE_NOTES = OCTAVES.reduce<MFOctavalNote[]>(
  (notes, octave) => [
    ...notes,
    ...NOTES.map(note => `${note}${octave}` as MFOctavalNote),
  ],
  [],
)

export const OCTAVE_NOTE_SET = new Set<MFOctavalNote>(OCTAVE_NOTES)
