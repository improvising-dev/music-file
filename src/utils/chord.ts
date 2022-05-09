import { MusicFileError } from '../common/error'
import { CHORD_NOTES_MAP, CHORD_SET } from '../constants/chord'
import { NOTE_INDEX_MAP, OCTAVE_NOTE_INDEX_MAP } from '../constants/note'
import { MAX_OCTAVE, MIN_OCTAVE } from '../constants/octave'
import { MFChord } from '../types/chord'
import { MFOctaveNote } from '../types/note'
import { MFOctave } from '../types/octave'
import { ensureValidOctave } from './octave'

export const isValidChord = (x: string): x is MFChord => {
  return CHORD_SET.has(x as MFChord)
}

export const ensureValidChord = (x: string) => {
  if (!isValidChord(x)) {
    throw new MusicFileError(`${x} is not a valid chord`)
  }

  return x
}

export const getChordNotes = (chord: MFChord) => {
  return CHORD_NOTES_MAP[chord]
}

export const getChordOctaveNotes = (chord: MFChord, baseOctave: MFOctave) => {
  const notes = getChordNotes(chord)
  const octaveNotes: MFOctaveNote[] = []

  let octave = baseOctave
  let lastNoteIndex = -1

  for (const note of notes) {
    const noteIndex = NOTE_INDEX_MAP[note]

    if (noteIndex < lastNoteIndex) {
      octave = ensureValidOctave(Math.min(octave + 1, MAX_OCTAVE))
    }

    lastNoteIndex = noteIndex

    octaveNotes.push(`${note}${octave}`)
  }

  return octaveNotes
}

export const getChordSpan = (chord: MFChord) => {
  const octaveNotes = getChordOctaveNotes(chord, MIN_OCTAVE)
  const top = OCTAVE_NOTE_INDEX_MAP[octaveNotes[octaveNotes.length - 1]]
  const bottom = OCTAVE_NOTE_INDEX_MAP[octaveNotes[0]]

  return top - bottom + 1
}
