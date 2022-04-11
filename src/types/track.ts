import { MFChord } from './chord'
import { MFInstrument } from './instrument'
import { MFNote } from './note'
import { MFOctave } from './octave'

export interface MFTrack {
  id: string
  metadata: {
    name: string
    instrument: MFInstrument
    directive?: boolean
    muted?: boolean
  }
  items: MFTrackItem[]
}

export interface MFTrackItem {
  id: string
  name: MFNote | MFChord
  octave: MFOctave
  begin: number
  duration: number
}

export namespace MFTrackItemType {
  export type Note = MFTrackItem & { name: MFNote }
  export type Chord = MFTrackItem & { name: MFChord }
}
