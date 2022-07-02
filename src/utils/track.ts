import { hasInteraction } from '../common/algorithm'
import { MusicFileError } from '../common/error'
import { generateRandomId } from '../common/random'
import { NOTES, NOTE_INDEX_MAP } from '../constants/note'
import { MFInstrument } from '../types/instrument'
import {
  MFChordTrackItem,
  MFNoteTrackItem,
  MFTrack,
  MFTrackItem,
  MFTrackItemType,
} from '../types/track'
import { getChordOctaveNotes, isValidChord } from './chord'
import { buildOctaveNote, isValidNote } from './note'
import { ensureValidOctave } from './octave'

type Optional<T, P extends keyof T> = Omit<T, P> & { [K in P]?: T[K] }

export const generateTrackId = () => generateRandomId()
export const generateTrackItemId = () => generateRandomId()

export const buildTrack = ({
  id,
  metadata,
  items = [],
}: Optional<MFTrack, 'id' | 'items'>): MFTrack => {
  return {
    id: id ?? generateTrackId(),
    metadata,
    items,
  }
}

export const buildTrackItem = ({
  id,
  name,
  octave,
  begin,
  duration,
}: Optional<MFTrackItem, 'id'>): MFTrackItem => {
  return {
    id: id ?? generateTrackItemId(),
    name,
    octave,
    begin,
    duration,
  }
}

export const cloneTrack = (
  track: MFTrack,
  { id, metadata, items }: Partial<MFTrack> = {},
) => {
  const source: MFTrack = JSON.parse(JSON.stringify(track))

  return {
    id: id ?? source.id,
    metadata: metadata ?? source.metadata,
    items: items ?? source.items,
  }
}

export const cloneTrackItem = (
  item: MFTrackItem,
  { id, name, octave, begin, duration }: Partial<MFTrackItem> = {},
): MFTrackItem => {
  return {
    id: id ?? item.id,
    name: name ?? item.name,
    octave: octave ?? item.octave,
    begin: begin ?? item.begin,
    duration: duration ?? item.duration,
  }
}

export const getTrackItemType = (item: MFTrackItem): MFTrackItemType => {
  if (isNoteTrackItem(item)) {
    return 'note'
  }

  if (isChordTrackItem(item)) {
    return 'chord'
  }

  throw new MusicFileError(`${item.name} is not a valid type`)
}

export const isNoteTrackItem = (item: MFTrackItem): item is MFNoteTrackItem => {
  return isValidNote(item.name)
}

export const isChordTrackItem = (
  item: MFTrackItem,
): item is MFChordTrackItem => {
  return isValidChord(item.name)
}

export const ensureNoteTrackItem = (item: MFTrackItem) => {
  if (!isNoteTrackItem(item)) {
    throw new MusicFileError(`${item.name} is not a valid note`)
  }

  return item
}

export const ensureChordTrackItem = (item: MFTrackItem) => {
  if (!isChordTrackItem(item)) {
    throw new MusicFileError(`${item.name} is not a valid chord`)
  }

  return item
}

export const compareTrackItem = (a: MFTrackItem, b: MFTrackItem) => {
  if (a.begin === b.begin) {
    if (a.duration === b.duration) {
      if (a.id === b.id) {
        return 0
      }

      return a.id < b.id ? -1 : 1
    }

    return a.duration < b.duration ? -1 : 1
  } else {
    return a.begin < b.begin ? -1 : 1
  }
}

export const isTrackItemEqual = (a: MFTrackItem, b: MFTrackItem) => {
  return (
    a.id === b.id &&
    a.name === b.name &&
    a.octave === b.octave &&
    a.begin === b.begin &&
    a.duration === b.duration
  )
}

export const isTrackItemTicksOverlapped = (a: MFTrackItem, b: MFTrackItem) => {
  if (a.id === b.id) {
    return false
  }

  const rangeA = [a.begin, a.begin + a.duration]
  const rangeB = [b.begin, b.begin + b.duration]

  return (
    (rangeA[0] <= rangeB[0] && rangeA[1] > rangeB[0]) ||
    (rangeB[0] <= rangeA[0] && rangeB[1] > rangeA[0])
  )
}

export const isTrackItemOverlapped = (a: MFTrackItem, b: MFTrackItem) => {
  if (a.id === b.id) {
    return false
  }

  const hasNameInteraction = hasInteraction(
    isChordTrackItem(a)
      ? getChordOctaveNotes(a.name, a.octave)
      : isNoteTrackItem(a)
      ? [buildOctaveNote(a.name, a.octave)]
      : [],
    isChordTrackItem(b)
      ? getChordOctaveNotes(b.name, b.octave)
      : isNoteTrackItem(b)
      ? [buildOctaveNote(b.name, b.octave)]
      : [],
  )

  if (!hasNameInteraction) {
    return false
  }

  return isTrackItemTicksOverlapped(a, b)
}

export const expandTrackItemLeft = (item: MFTrackItem, ticks: number) => {
  return cloneTrackItem(item, {
    begin: item.begin - ticks,
    duration: item.duration + ticks,
  })
}

export const expandTrackItemRight = (item: MFTrackItem, ticks: number) => {
  return cloneTrackItem(item, {
    duration: item.duration + ticks,
  })
}

export const moveTrackItemRight = (item: MFTrackItem, ticks: number) => {
  return cloneTrackItem(item, {
    begin: item.begin + ticks,
  })
}

export const moveTrackItemUp = (item: MFTrackItem, semitones: number) => {
  if (isNoteTrackItem(item)) {
    const index = NOTE_INDEX_MAP[item.name] + semitones
    const name = NOTES.slice(index % NOTES.length)[0]
    const delta = Math.floor(index / NOTES.length)
    const octave = ensureValidOctave(item.octave + delta)

    return buildTrackItem({
      id: item.id,
      name,
      octave,
      begin: item.begin,
      duration: item.duration,
    })
  }

  return item
}

export class TrackProxy {
  constructor(private track: MFTrack) {}

  getName() {
    return this.track.metadata.name
  }

  getInstrument() {
    return this.track.metadata.instrument
  }

  getMuted() {
    return Boolean(this.track.metadata.muted)
  }

  getCategory() {
    return this.track.metadata.category
  }

  setName(name: string) {
    this.track.metadata.name = name
  }

  setInstrument(instrument: MFInstrument) {
    this.track.metadata.instrument = instrument
  }

  setMuted(muted: boolean) {
    this.track.metadata.muted = muted
  }

  setCategory(category: string) {
    this.track.metadata.category = category
  }

  deleteInstrument() {
    delete this.track.metadata.instrument
  }

  deleteCategory() {
    delete this.track.metadata.category
  }

  findTicksOverlappedTrackItem(
    source: MFTrackItem,
    excludes: MFTrackItem[] = [],
  ) {
    return this.track.items
      .filter(item => !excludes.some(el => isTrackItemEqual(el, item)))
      .find(item => isTrackItemTicksOverlapped(source, item))
  }

  findTicksOverlappedTrackItems(
    source: MFTrackItem,
    excludes: MFTrackItem[] = [],
  ) {
    return this.track.items
      .filter(item => !excludes.some(el => isTrackItemEqual(el, item)))
      .filter(item => isTrackItemTicksOverlapped(source, item))
  }

  findOverlappedTrackItem(source: MFTrackItem, excludes: MFTrackItem[] = []) {
    return this.track.items
      .filter(item => !excludes.some(el => isTrackItemEqual(el, item)))
      .find(item => isTrackItemOverlapped(source, item))
  }

  findOverlappedTrackItems(source: MFTrackItem, excludes: MFTrackItem[] = []) {
    return this.track.items
      .filter(item => !excludes.some(el => isTrackItemEqual(el, item)))
      .filter(item => isTrackItemOverlapped(source, item))
  }

  sortTrackItems() {
    return this.track.items.sort(compareTrackItem)
  }

  clearTrackItems() {
    this.track.items = []
  }

  addTrackItem(source: MFTrackItem) {
    if (
      this.track.items.length === 0 ||
      this.track.items[0].begin > source.begin
    ) {
      this.track.items.unshift(source)
    } else {
      for (let i = 0; i < this.track.items.length; i++) {
        const item = this.track.items[i]

        if (item.begin <= source.begin) {
          const result = compareTrackItem(item, source)

          if (result < 0) {
            this.track.items.splice(i + 1, 0, source)
          } else {
            this.track.items.splice(i, 0, source)
          }

          return
        }
      }

      this.track.items.push(source)
    }
  }

  deleteTrackItem(source: MFTrackItem) {
    for (let i = 0; i < this.track.items.length; i++) {
      if (this.track.items[i].id === source.id) {
        this.track.items.splice(i, 1)
        return
      }
    }
  }

  replaceTrackItem(source: MFTrackItem, target: MFTrackItem) {
    this.deleteTrackItem(source)
    this.addTrackItem(target)
  }
}

export const getTrackProxy = (track: MFTrack) => new TrackProxy(track)
