import { MFUnitNoteType } from '../types/unit-note-type'

export const UNIT_NOTE_TYPES: readonly MFUnitNoteType[] = [64, 32, 16] as const

export const UNIT_NOTE_TYPE_SET = new Set<MFUnitNoteType>(UNIT_NOTE_TYPES)
