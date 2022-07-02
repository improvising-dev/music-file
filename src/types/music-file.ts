import { MFKey } from './key'
import { MFSignature } from './signature'
import { MFTrack } from './track'
import { MFUnitNoteType } from './unit-note-type'

export interface MFMusicFile {
  metadata: {
    name: string
    key: MFKey
    signature: MFSignature
    unitNoteType: MFUnitNoteType
    bpm: number
    numBars: number
  }
  tracks: MFTrack[]
}
