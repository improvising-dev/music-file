import { MFMusicFile } from '../types/music-file'
import { MFTrack } from '../types/track'

export const cloneMusicFile = (source: MFMusicFile): MFMusicFile => {
  return JSON.parse(JSON.stringify(source))
}

export const getMusicFileOps = (musicFile: MFMusicFile) => {
  const { metadata, tracks } = musicFile
  const { signature, unitNoteType, bpm, numBars } = metadata

  const [numBeats, beatNoteType] = signature

  const getBeatNoteType = () => {
    return beatNoteType
  }

  const getNumBeats = () => {
    return numBeats
  }

  const getNumTicksPerBeat = () => {
    return unitNoteType / beatNoteType
  }

  const getNumTicksPerBar = () => {
    return numBeats * getNumTicksPerBeat()
  }

  const getNumTicks = () => {
    return numBars * getNumTicksPerBar()
  }

  const getTickMs = () => {
    const numTicksPerBeat = getNumTicksPerBeat()
    const tickMs = (60 * 1000) / (numTicksPerBeat * bpm)

    return tickMs
  }

  const findProgressionTrack = () => {
    return tracks.find(track => track.metadata.progression)
  }

  const findMutedTracks = () => {
    return tracks.filter(track => track.metadata.muted)
  }

  const findUnmutedTracks = () => {
    return tracks.filter(track => !track.metadata.muted)
  }

  const sortTracks = () => {
    const index = tracks.findIndex(track => track.metadata.progression)

    if (index >= 0) {
      const progressionTrack = tracks[index]

      tracks.splice(index, 1)
      tracks.push(progressionTrack)
    }
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

  const replaceTrack = (source: MFTrack, target: MFTrack) => {
    const index = tracks.findIndex(track => track.id === source.id)

    tracks[index] = target
  }

  return {
    getBeatNoteType,
    getNumBeats,
    getNumTicksPerBar,
    getNumTicksPerBeat,
    getNumTicks,
    getTickMs,
    findProgressionTrack,
    findMutedTracks,
    findUnmutedTracks,
    sortTracks,
    addTrack,
    deleteTrack,
    moveTrack,
    replaceTrack,
  }
}
