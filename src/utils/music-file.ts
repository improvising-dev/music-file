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
  instrument?: string
  muted?: boolean
  category?: string
}

export type MusicFileProxyObserver = (proxy: MusicFileProxy) => void

export class MusicFileProxy {
  private observers: MusicFileProxyObserver[]

  constructor(private musicFile: MFMusicFile) {
    this.observers = []
  }

  observe(observer: MusicFileProxyObserver) {
    this.observers.push(observer)

    return () => {
      this.observers = this.observers.filter(item => item !== observer)
    }
  }

  notifyChanges() {
    this.observers.forEach(observer => observer(this))

    return this
  }

  values() {
    return this.musicFile
  }

  shadowValues() {
    return { ...this.musicFile }
  }

  getVersion() {
    return this.musicFile.metadata.version
  }

  getName() {
    return this.musicFile.metadata.name
  }

  getKey() {
    return this.musicFile.metadata.key
  }

  getTempo() {
    const { metadata } = this.musicFile
    const { signature, unitNoteType, bpm, numBars } = metadata

    const [numBeats, beatNoteType] = signature

    const numTicksPerBeat = unitNoteType / beatNoteType
    const numTicksPerBar = numBeats * numTicksPerBeat
    const numTicks = numBars * numTicksPerBar
    const tickMs = (60 * 1000) / (numTicksPerBeat * bpm)

    return {
      signature,
      numBeats,
      beatNoteType,
      unitNoteType,
      bpm,
      numBars,
      numTicksPerBeat,
      numTicksPerBar,
      numTicks,
      tickMs,
    }
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

  getCustomMetadata<T>(key: string) {
    return (this.musicFile.metadata as any)[key] as T
  }

  getCustomValue<T>(key: string) {
    return (this.musicFile as any)[key] as T
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
    const items = this.musicFile.tracks
      .filter(track => track.items.length > 0)
      .map(track => track.items.slice(-1)[0])
      .sort((a, b) => (a.begin + a.duration < b.begin + b.duration ? -1 : 1))
      .slice(-1)

    if (items.length === 0) {
      return null
    }

    return items[0]
  }

  setName(name: string) {
    this.musicFile.metadata.name = name

    return this
  }

  setKey(key: MFKey) {
    this.musicFile.metadata.key = key

    return this
  }

  setSignature(signature: MFSignature) {
    this.musicFile.metadata.signature = signature
    this.ensureMatchedNumBars()

    return this
  }

  setSignatureUnsafe(signature: MFSignature) {
    this.musicFile.metadata.signature = signature

    return this
  }

  setUnitNoteType(unitNoteType: MFUnitNoteType) {
    this.musicFile.metadata.unitNoteType = unitNoteType
    this.ensureMatchedNumBars()

    return this
  }

  setUnitNoteTypeUnsafe(unitNoteType: MFUnitNoteType) {
    this.musicFile.metadata.unitNoteType = unitNoteType

    return this
  }

  setBPM(bpm: number) {
    this.musicFile.metadata.bpm = bpm

    return this
  }

  setNumBars(numBars: number) {
    const lastItem = this.getLastTrackItem()
    const updatedNumTicks = this.getNumTicksPerBar() * numBars

    if (!lastItem || lastItem.begin + lastItem.duration <= updatedNumTicks) {
      this.musicFile.metadata.numBars = numBars
    }

    return this
  }

  setNumBarsUnsafe(numBars: number) {
    this.musicFile.metadata.numBars = numBars

    return this
  }

  setCustomMetadata(key: string, value: any) {
    Object.assign(this.musicFile.metadata, { [key]: value })

    return this
  }

  setCustomValue(key: string, value: any) {
    Object.assign(this.musicFile, { [key]: value })

    return this
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
      return null
    }

    return tracks[0]
  }

  findTrackNum(params: FindTrackParams = {}) {
    const source = this.findTrack(params)

    return this.musicFile.tracks.findIndex(track => track === source)
  }

  addTrack(source: MFTrack, insertPos?: number) {
    if (insertPos) {
      this.musicFile.tracks.splice(insertPos, 0, source)
    } else {
      this.musicFile.tracks.push(source)
    }

    return this
  }

  deleteTrack(source: MFTrack | number) {
    if (typeof source === 'number') {
      this.musicFile.tracks.splice(source, 1)
    } else {
      for (let i = 0; i < this.musicFile.tracks.length; i++) {
        if (this.musicFile.tracks[i].id === source.id) {
          this.musicFile.tracks.splice(i, 1)
          break
        }
      }
    }

    return this
  }

  replaceTrack(source: MFTrack | number, target: MFTrack) {
    const index =
      typeof source === 'number' ? source : this.findTrackNum({ id: source.id })

    if (index >= 0 && index < this.musicFile.tracks.length) {
      this.musicFile.tracks[index] = target
    }

    return this
  }

  ensureMatchedNumBars() {
    const lastItem = this.getLastTrackItem()

    if (lastItem) {
      const leastNumTicks = lastItem.begin + lastItem.duration
      const numBars = Math.ceil(leastNumTicks / this.getNumTicksPerBar())

      this.musicFile.metadata.numBars = numBars
    }

    return this
  }
}

export const useMusicFileProxy = (musicFile: MFMusicFile) =>
  new MusicFileProxy(musicFile)
