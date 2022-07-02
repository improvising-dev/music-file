import { MFInstrument } from '../types/instrument'
import { MFKey } from '../types/key'
import { MFMusicFile } from '../types/music-file'
import { MFSignature } from '../types/signature'
import { MFTrack } from '../types/track'
import { MFUnitNoteType } from '../types/unit-note-type'

export const cloneMusicFile = (musicFile: MFMusicFile): MFMusicFile => {
  return JSON.parse(JSON.stringify(musicFile))
}

export interface FindTrackParams {
  id?: string
  instrument?: MFInstrument
  muted?: boolean
  category?: string
}

export class MusicFileAccessor {
  constructor(private musicFile: MFMusicFile) {}

  getName() {
    return this.musicFile.metadata.name
  }

  getKey() {
    return this.musicFile.metadata.key
  }

  getSignature() {
    return this.musicFile.metadata.signature
  }

  getNumBeats() {
    return this.musicFile.metadata.signature[0]
  }

  getBeatNoteType() {
    return this.musicFile.metadata.signature[1]
  }

  getUnitNoteType() {
    return this.musicFile.metadata.unitNoteType
  }

  getBPM() {
    return this.musicFile.metadata.bpm
  }

  getNumBars() {
    return this.musicFile.metadata.numBars
  }

  getNumTicksPerBeat() {
    return this.getUnitNoteType() / this.getBeatNoteType()
  }

  getNumTicksPerBar() {
    return this.getNumBeats() * this.getNumTicksPerBeat()
  }

  getNumTicks() {
    return this.getNumBars() * this.getNumTicksPerBar()
  }

  getTickMs() {
    return (60 * 1000) / (this.getNumTicksPerBeat() * this.getBPM())
  }

  getLastTrackItem() {
    return this.musicFile.tracks
      .filter(track => track.items.length > 0)
      .map(track => track.items.slice(-1)[0])
      .sort((a, b) => (a.begin + a.duration < b.begin + b.duration ? -1 : 1))
      .slice(-1)[0]
  }

  setName(name: string) {
    this.musicFile.metadata.name = name
  }

  setKey(key: MFKey) {
    this.musicFile.metadata.key = key
  }

  setSignature(signature: MFSignature) {
    this.musicFile.metadata.signature = signature
    this.ensureMatchedNumbers()
  }

  setSignatureUnsafe(signature: MFSignature) {
    this.musicFile.metadata.signature = signature
  }

  setUnitNoteType(unitNoteType: MFUnitNoteType) {
    this.musicFile.metadata.unitNoteType = unitNoteType
    this.ensureMatchedNumbers()
  }

  setUnitNoteTypeUnsafe(unitNoteType: MFUnitNoteType) {
    this.musicFile.metadata.unitNoteType = unitNoteType
  }

  setBPM(bpm: number) {
    this.musicFile.metadata.bpm = bpm
  }

  setNumBars(numBars: number) {
    const lastItem = this.getLastTrackItem()
    const updatedNumTicks = this.getNumTicksPerBar() * numBars

    if (lastItem.begin + lastItem.duration <= updatedNumTicks) {
      this.musicFile.metadata.numBars = numBars
    }
  }

  setNumBarsUnsafe(numBars: number) {
    this.musicFile.metadata.numBars = numBars
  }

  findTracks({ id, instrument, muted, category }: FindTrackParams = {}) {
    return this.musicFile.tracks.filter(track => {
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

  findTrack(params: FindTrackParams = {}) {
    const tracks = this.findTracks(params)

    if (tracks.length === 0) {
      return undefined
    }

    return tracks[0]
  }

  findTrackNum(params: FindTrackParams = {}) {
    const source = this.findTrack(params)

    return this.musicFile.tracks.findIndex(track => track === source)
  }

  addTrack(source: MFTrack) {
    this.musicFile.tracks.push(source)
  }

  deleteTrack(source: MFTrack) {
    for (let i = 0; i < this.musicFile.tracks.length; i++) {
      if (this.musicFile.tracks[i].id === source.id) {
        this.musicFile.tracks.splice(i, 1)
        return
      }
    }
  }

  moveTrack(source: MFTrack, newIndex: number) {
    this.deleteTrack(source)
    this.musicFile.tracks.splice(newIndex, 0, source)
  }

  replaceTrack(source: MFTrack, target: MFTrack) {
    const index = this.findTrackNum({ id: source.id })

    this.musicFile.tracks[index] = target
  }

  ensureMatchedNumbers = () => {
    const lastItem = this.getLastTrackItem()
    const actualNumTicks = lastItem.begin + lastItem.duration
    const numBars = Math.ceil(actualNumTicks / this.getNumTicksPerBar())

    this.musicFile.metadata.numBars = numBars
  }
}

export const accessMusicFile = (musicFile: MFMusicFile) =>
  new MusicFileAccessor(musicFile)
