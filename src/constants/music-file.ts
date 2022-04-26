import { MFMusicFile } from '../types/music-file'

export const DEFAULT_MUSIC_FILE: MFMusicFile = {
  metadata: {
    name: 'Untitled',
    key: 'C',
    signature: [4, 4],
    unitNoteType: 64,
    bpm: 120,
    numBars: 2,
  },
  tracks: [],
}
