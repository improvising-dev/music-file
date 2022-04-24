import { MFChord } from '../types/chord'
import { MFNote } from '../types/note'

export const CHORDS: readonly MFChord[] = [
  'I',
  'II',
  'III',
  'IV',
  'V',
  'VI',
  'VII',
  'I7',
  'II7',
  'III7',
  'IV7',
  'V7',
  'VI7',
  'VII7',
  'i',
  'ii',
  'iii',
  'iv',
  'v',
  'vi',
  'vii',
  'vii-dim',
  'V/V',
  'i7',
  'ii7',
  'iii7',
  'iv7',
  'v7',
  'vi7',
  'vii7',
] as const

export const CHORD_SET = new Set<MFChord>(CHORDS)

export const CHORD_INDEX_MAP = CHORDS.reduce((prev, curr, index) => {
  prev[curr] = index
  return prev
}, {} as Record<MFChord, number>)

export const CHORD_NOTES_MAP: Record<MFChord, readonly MFNote[]> = {
  I: ['do', 'mi', 'sol'],
  II: ['re', 'fa#', 'la'],
  III: ['mi', 'sol#', 'ti'],
  IV: ['fa', 'la', 'do'],
  V: ['sol', 'ti', 're'],
  VI: ['la', 'do#', 'mi'],
  VII: ['ti', 're#', 'fa#'],
  I7: ['do', 'mi', 'sol', 'ti'],
  II7: ['re', 'fa#', 'la', 'do#'],
  III7: ['mi', 'sol#', 'ti', 're#'],
  IV7: ['fa', 'la', 'do', 'mi'],
  V7: ['sol', 'ti', 're', 'fa#'],
  VI7: ['la', 'do#', 'mi', 'sol#'],
  VII7: ['ti', 're#', 'fa#', 'la#'],
  i: ['do', 're#', 'sol'],
  ii: ['re', 'fa', 'la'],
  iii: ['mi', 'sol', 'ti'],
  iv: ['fa', 'sol#', 'do'],
  v: ['sol', 'la#', 're'],
  vi: ['la', 'do', 'mi'],
  vii: ['ti', 're', 'fa#'],
  'vii-dim': ['ti', 're', 'fa'],
  'V/V': ['re', 'fa#', 'la'],
  i7: ['do', 're#', 'sol', 'la#'],
  ii7: ['re', 'fa', 'la', 'do'],
  iii7: ['mi', 'sol', 'ti', 're'],
  iv7: ['fa', 'sol#', 'do', 're#'],
  v7: ['sol', 'la#', 're', 'fa'],
  vi7: ['la', 'do', 'mi', 'sol'],
  vii7: ['ti', 're', 'fa#', 'la'],
} as const
