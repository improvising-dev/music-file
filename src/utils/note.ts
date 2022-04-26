import { MusicFileError } from '../common/error'
import {
  NOTE_INDEX_MAP,
  NOTE_SET,
  OCTAVE_NOTE_INDEX_MAP,
  OCTAVE_NOTE_SET,
} from '../constants/note'
import { MFNote, MFOctaveNote } from '../types/note'
import { MFOctave } from '../types/octave'
import { ensureValidOctave } from './octave'

export const isValidNote = (x: string): x is MFNote => {
  return NOTE_SET.has(x as MFNote)
}

export const isValidOctaveNote = (x: string): x is MFOctaveNote => {
  return OCTAVE_NOTE_SET.has(x as MFOctaveNote)
}

export const ensureValidNote = (x: string) => {
  if (!isValidNote(x)) {
    throw new MusicFileError(`${x} is not a valid note`)
  }

  return x
}

export const ensureValidOctaveNote = (x: string) => {
  if (!isValidOctaveNote(x)) {
    throw new MusicFileError(`${x} is not a valid octave note`)
  }

  return x
}

export const isAccidentalNote = (note: MFNote | MFOctaveNote) => {
  return note.includes('#')
}

export const getNoteIndex = (note: MFNote) => {
  return NOTE_INDEX_MAP[note]
}

export const getOctaveNoteIndex = (octaveNote: MFOctaveNote) => {
  return OCTAVE_NOTE_INDEX_MAP[octaveNote]
}

export const buildOctaveNote = (
  note: MFNote,
  octave: MFOctave,
): MFOctaveNote => {
  return `${note}${octave}`
}

export const splitOctaveNote = (octaveNote: MFOctaveNote) => {
  ensureValidOctaveNote(octaveNote)

  const note = ensureValidNote(octaveNote.slice(0, -1))
  const octave = ensureValidOctave(Number(octaveNote.slice(-1)))

  return [note, octave] as const
}
