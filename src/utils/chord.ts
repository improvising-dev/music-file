import { MusicFileError } from '../common/error'
import { CHORD_NOTES_MAP, CHORD_SET } from '../constants/chord'
import { NOTE_INDEX_MAP } from '../constants/note'
import { MAX_OCTAVE } from '../constants/octave'
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

export const getChordOctaveNotes = (chord: MFChord, baseOctave: MFOctave) => {
  const notes = CHORD_NOTES_MAP[chord]
  const octaveNotes: MFOctaveNote[] = []

  let octave = baseOctave
  let lastNoteIndex = NOTE_INDEX_MAP[notes[0]]

  for (const note of notes) {
    const currentNoteIndex = NOTE_INDEX_MAP[note]

    if (currentNoteIndex < lastNoteIndex) {
      octave = ensureValidOctave(Math.min(octave + 1, MAX_OCTAVE))
    }

    lastNoteIndex = currentNoteIndex

    octaveNotes.push(`${note}${octave}`)
  }

  return octaveNotes
}
