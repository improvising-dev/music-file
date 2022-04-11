import { MusicFileError } from '../common/error'
import { NOTE_SET, OCTAVE_NOTE_SET } from '../constants/note'
import { MFNote, MFOctavalNote } from '../types/note'
import { ensureValidOctave } from './octave'

export const isValidNote = (x: string): x is MFNote => {
  return NOTE_SET.has(x as MFNote)
}

export const isValidOctavalNote = (x: string): x is MFOctavalNote => {
  return OCTAVE_NOTE_SET.has(x as MFOctavalNote)
}

export const ensureValidNote = (x: string) => {
  if (!isValidNote(x)) {
    throw new MusicFileError(`${x} is not a valid note`)
  }

  return x
}

export const ensureValidOctavalNote = (x: string) => {
  if (!isValidOctavalNote(x)) {
    throw new MusicFileError(`${x} is not a valid octaval note`)
  }

  return x
}

export const splitOctavalNote = (octavalNote: MFOctavalNote) => {
  ensureValidOctavalNote(octavalNote)

  const note = ensureValidNote(octavalNote.slice(0, -1))
  const octave = ensureValidOctave(Number(octavalNote.slice(-1)))

  return [note, octave]
}
