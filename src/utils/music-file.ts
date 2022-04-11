import { MFMusicFile } from '../types/music-file'
import { MFTrack } from '../types/track'

export const cloneMusicFile = (source: MFMusicFile): MFMusicFile => {
  return JSON.parse(JSON.stringify(source))
}

export const getMusicFileOps = (musicFile: MFMusicFile) => {
  const { metadata, tracks } = musicFile
  const { signature, unitNoteType, bpm, numBars } = metadata

  const [numBeat, beatNoteType] = signature

  const getNumTicks = () => {
    const tickPerBeat = unitNoteType / beatNoteType
    const ticks = numBars * numBeat * tickPerBeat

    return ticks
  }

  const getTickMs = () => {
    const tickPerBeat = unitNoteType / beatNoteType
    const tickMs = (60 * 1000) / (tickPerBeat * bpm)

    return tickMs
  }

  const addTrack = (source: MFTrack) => {
    tracks.push(source)
  }

  const deleteTrack = (source: MFTrack) => {
    for (let i = 0; i < tracks.length; i++) {
      if (tracks[i].id === source.id) {
        tracks.splice(i, 1)
        return
      }
    }
  }

  const moveTrack = (source: MFTrack, newIndex: number) => {
    deleteTrack(source)

    tracks.splice(newIndex, 0, source)
  }

  return {
    getNumTicks,
    getTickMs,
    addTrack,
    deleteTrack,
    moveTrack,
  }
}
