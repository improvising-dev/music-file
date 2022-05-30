import { MFInstrument } from '../types/instrument'
import { MFKey } from '../types/key'
import { MFMusicFile } from '../types/music-file'
import { MFSignature } from '../types/signature'
import { MFTrack } from '../types/track'
import { MFUnitNoteType } from '../types/unit-note-type'

export interface FindTrackParams {
  id?: string
  instrument?: MFInstrument
  muted?: boolean
  category?: string
}

export const cloneMusicFile = (source: MFMusicFile): MFMusicFile => {
  return JSON.parse(JSON.stringify(source))
}

export const getMusicFileOps = (musicFile: MFMusicFile) => {
  const getName = () => {
    return musicFile.metadata.name
  }

  const getKey = () => {
    return musicFile.metadata.key
  }

  const getSignature = () => {
    return musicFile.metadata.signature
  }

  const getNumBeats = () => {
    return musicFile.metadata.signature[0]
  }

  const getBeatNoteType = () => {
    return musicFile.metadata.signature[1]
  }

  const getUnitNoteType = () => {
    return musicFile.metadata.unitNoteType
  }

  const getBPM = () => {
    return musicFile.metadata.bpm
  }

  const getNumBars = () => {
    return musicFile.metadata.numBars
  }

  const getNumTicksPerBeat = () => {
    return getUnitNoteType() / getBeatNoteType()
  }

  const getNumTicksPerBar = () => {
    return getNumBeats() * getNumTicksPerBeat()
  }

  const getNumTicks = () => {
    return getNumBars() * getNumTicksPerBar()
  }

  const getTickMs = () => {
    return (60 * 1000) / (getNumTicksPerBeat() * getBPM())
  }

  const getLastTrackItem = () => {
    return musicFile.tracks
      .filter(track => track.items.length > 0)
      .map(track => track.items.slice(-1)[0])
      .sort((a, b) => (a.begin + a.duration < b.begin + b.duration ? -1 : 1))
      .slice(-1)[0]
  }

  const matchNumBars = () => {
    const lastItem = getLastTrackItem()
    const actualNumTicks = lastItem.begin + lastItem.duration
    const numBars = Math.ceil(actualNumTicks / getNumTicksPerBar())

    musicFile.metadata.numBars = numBars
  }

  const setName = (name: string) => {
    musicFile.metadata.name = name
  }

  const setKey = (key: MFKey) => {
    musicFile.metadata.key = key
  }

  const setSignature = (signature: MFSignature) => {
    musicFile.metadata.signature = signature

    matchNumBars()
  }

  const setSignatureUnsafe = (signature: MFSignature) => {
    musicFile.metadata.signature = signature
  }

  const setUnitNoteType = (unitNoteType: MFUnitNoteType) => {
    musicFile.metadata.unitNoteType = unitNoteType

    matchNumBars()
  }

  const setUnitNoteTypeUnsafe = (unitNoteType: MFUnitNoteType) => {
    musicFile.metadata.unitNoteType = unitNoteType
  }

  const setBPM = (bpm: number) => {
    musicFile.metadata.bpm = bpm
  }

  const setNumBars = (numBars: number) => {
    const lastItem = getLastTrackItem()
    const updatedNumTicks = getNumTicks() - getNumTicksPerBar()

    if (lastItem.begin + lastItem.duration <= updatedNumTicks) {
      musicFile.metadata.numBars = numBars
    }
  }

  const setNumBarsUnsafe = (numBars: number) => {
    musicFile.metadata.numBars = numBars
  }

  const findTracks = ({
    id,
    instrument,
    muted,
    category,
  }: FindTrackParams = {}) => {
    return musicFile.tracks.filter(track => {
      if (id !== undefined && track.id !== id) {
        return false
      }

      if (
        instrument !== undefined &&
        instrument !== track.metadata.instrument
      ) {
        return false
      }

      if (muted !== undefined && muted !== Boolean(track.metadata.muted)) {
        return false
      }

      if (category !== undefined && category !== track.metadata.category) {
        return false
      }

      return true
    })
  }

  const findTrack = (params: FindTrackParams = {}) => {
    const tracks = findTracks(params)

    if (tracks.length === 0) {
      return undefined
    }

    return tracks[0]
  }

  const findTrackNum = (params: FindTrackParams = {}) => {
    const source = findTrack(params)

    return musicFile.tracks.findIndex(track => track === source)
  }

  const addTrack = (source: MFTrack) => {
    musicFile.tracks.push(source)
  }

  const deleteTrack = (source: MFTrack) => {
    for (let i = 0; i < musicFile.tracks.length; i++) {
      if (musicFile.tracks[i].id === source.id) {
        musicFile.tracks.splice(i, 1)
        return
      }
    }
  }

  const moveTrack = (source: MFTrack, newIndex: number) => {
    deleteTrack(source)

    musicFile.tracks.splice(newIndex, 0, source)
  }

  const replaceTrack = (source: MFTrack, target: MFTrack) => {
    const index = musicFile.tracks.findIndex(track => track.id === source.id)

    musicFile.tracks[index] = target
  }

  return {
    getName,
    getKey,
    getSignature,
    getNumBeats,
    getBeatNoteType,
    getUnitNoteType,
    getBPM,
    getNumBars,
    getNumTicksPerBar,
    getNumTicksPerBeat,
    getNumTicks,
    getTickMs,
    setName,
    setKey,
    setSignature,
    setSignatureUnsafe,
    setUnitNoteType,
    setUnitNoteTypeUnsafe,
    setBPM,
    setNumBars,
    setNumBarsUnsafe,
    findTracks,
    findTrack,
    findTrackNum,
    addTrack,
    deleteTrack,
    moveTrack,
    replaceTrack,
  }
}
