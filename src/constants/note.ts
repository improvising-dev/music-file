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

export const NOTE_INDEX_MAP = NOTES.reduce((prev, curr, index) => {
  prev[curr] = index
  return prev
}, {} as Record<MFNote, number>)

export const OCTAVE_NOTES = OCTAVES.reduce<readonly MFOctavalNote[]>(
  (notes, octave) => [
    ...notes,
    ...NOTES.map(note => `${note}${octave}` as MFOctavalNote),
  ],
  [],
)

export const OCTAVE_NOTE_SET = new Set<MFOctavalNote>(OCTAVE_NOTES)

export const OCTAVE_NOTE_INDEX_MAP = OCTAVE_NOTES.reduce(
  (prev, curr, index) => {
    prev[curr] = index
    return prev
  },
  {} as Record<MFOctavalNote, number>,
)
