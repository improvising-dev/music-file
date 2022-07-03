import { MFKey } from './key'
import { MFSignature } from './signature'
import { MFTrack } from './track'
import { MFUnitNoteType } from './unit-note-type'

export interface MFMusicFileMetadata {
  version: string
  name: string
  key: MFKey
  signature: MFSignature
  unitNoteType: MFUnitNoteType
  bpm: number
  numBars: number
}

export interface MFMusicFile {
  metadata: MFMusicFileMetadata
  tracks: MFTrack[]
}
