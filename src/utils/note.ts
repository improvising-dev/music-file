import { MusicFileError } from '../common/error'
import { NOTE_SET, OCTAVE_NOTE_SET } from '../constants/note'
import { MFNote, MFOctaveNote } from '../types/note'
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
    throw new MusicFileError(`${x} is not a valid octaval note`)
  }

  return x
}

export const splitOctaveNote = (octavalNote: MFOctaveNote) => {
  ensureValidOctaveNote(octavalNote)

  const note = ensureValidNote(octavalNote.slice(0, -1))
  const octave = ensureValidOctave(Number(octavalNote.slice(-1)))

  return [note, octave]
}
