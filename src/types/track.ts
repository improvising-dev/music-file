import { MFChord } from './chord'
import { MFInstrument } from './instrument'
import { MFNote } from './note'
import { MFOctave } from './octave'

export interface MFTrackMetadata {
  name: string
  instrument?: MFInstrument
  muted?: boolean
  category?: string
}

export interface MFTrack {
  id: string
  metadata: MFTrackMetadata
  items: MFTrackItem[]
}

export interface MFTrackItem {
  id: string
  name: MFNote | MFChord
  octave: MFOctave
  begin: number
  duration: number
}

export type MFTrackItemType = 'note' | 'chord'

export type MFNoteTrackItem = MFTrackItem & { name: MFNote }
export type MFChordTrackItem = MFTrackItem & { name: MFChord }
