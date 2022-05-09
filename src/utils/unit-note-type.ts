import { MusicFileError } from '../common/error'
import { UNIT_NOTE_TYPE_SET } from '../constants/unit-note-type'
import { MFUnitNoteType } from '../types/unit-note-type'

export const isValidUnitNoteType = (x: number): x is MFUnitNoteType => {
  return UNIT_NOTE_TYPE_SET.has(x as MFUnitNoteType)
}

export const ensureValidUnitNoteType = (x: number) => {
  if (!isValidUnitNoteType(x)) {
    throw new MusicFileError(`${x} is not a valid unit note type`)
  }

  return x
}
