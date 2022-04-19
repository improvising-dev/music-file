import { MFNote, MFOctaveNote } from '../types/note'
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

export const OCTAVE_NOTES = OCTAVES.reduce<readonly MFOctaveNote[]>(
  (notes, octave) => [
    ...notes,
    ...NOTES.map(note => `${note}${octave}` as MFOctaveNote),
  ],
  [],
)

export const OCTAVE_NOTE_SET = new Set<MFOctaveNote>(OCTAVE_NOTES)

export const OCTAVE_NOTE_INDEX_MAP = OCTAVE_NOTES.reduce(
  (prev, curr, index) => {
    prev[curr] = index
    return prev
  },
  {} as Record<MFOctaveNote, number>,
)
