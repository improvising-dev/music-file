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
  resources,
}: Optional<MFTrack, 'id' | 'items'>): MFTrack => {
  return {
    id: id ?? generateTrackId(),
    metadata,
    items,
    ...(resources && { resources }),
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
  { id, metadata, items, resources }: Partial<MFTrack> = {},
) => {
  const source: MFTrack = JSON.parse(JSON.stringify(track))

  return {
    id: id ?? source.id,
    metadata: metadata ?? source.metadata,
    items: items ?? source.items,
    resources: resources ?? source.resources,
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

export const getTrackOps = (track: MFTrack) => {
  const getName = () => {
    return track.metadata.name
  }

  const getInstrument = () => {
    return track.metadata.instrument
  }

  const getMuted = () => {
    return Boolean(track.metadata.muted)
  }

  const getCategory = () => {
    return track.metadata.category
  }

  const setName = (name: string) => {
    track.metadata.name = name
  }

  const setInstrument = (instrument: MFInstrument) => {
    track.metadata.instrument = instrument
  }

  const setMuted = (muted: boolean) => {
    track.metadata.muted = muted
  }

  const setCategory = (category: string) => {
    track.metadata.category = category
  }

  const deleteInstrument = () => {
    delete track.metadata.instrument
  }

  const deleteCategory = () => {
    delete track.metadata.instrument
  }

  const findOverlappedTrackItem = (source: MFTrackItem) => {
    return track.items.find(item => isTrackItemOverlapped(source, item))
  }

  const findOverlappedTrackItems = (source: MFTrackItem) => {
    return track.items.filter(item => isTrackItemOverlapped(source, item))
  }

  const findTicksOverlappedTrackItem = (source: MFTrackItem) => {
    return track.items.find(item => isTrackItemTicksOverlapped(source, item))
  }

  const findTicksOverlappedTrackItems = (source: MFTrackItem) => {
    return track.items.filter(item => isTrackItemTicksOverlapped(source, item))
  }

  const sortTrackItems = () => {
    return track.items.sort(compareTrackItem)
  }

  const clearTrackItems = () => {
    track.items = []
  }

  const addTrackItem = (source: MFTrackItem) => {
    if (track.items.length === 0 || track.items[0].begin > source.begin) {
      track.items.unshift(source)
    } else {
      for (let i = 0; i < track.items.length; i++) {
        const item = track.items[i]

        if (item.begin <= source.begin) {
          const result = compareTrackItem(item, source)

          if (result < 0) {
            track.items.splice(i + 1, 0, source)
          } else {
            track.items.splice(i, 0, source)
          }

          return
        }
      }

      track.items.push(source)
    }
  }

  const deleteTrackItem = (source: MFTrackItem) => {
    for (let i = 0; i < track.items.length; i++) {
      if (track.items[i].id === source.id) {
        track.items.splice(i, 1)
        return
      }
    }
  }

  const replaceTrackItem = (source: MFTrackItem, target: MFTrackItem) => {
    deleteTrackItem(source)
    addTrackItem(target)
  }

  return {
    getName,
    getInstrument,
    getMuted,
    getCategory,
    setName,
    setInstrument,
    setMuted,
    setCategory,
    deleteInstrument,
    deleteCategory,
    findOverlappedTrackItem,
    findOverlappedTrackItems,
    findTicksOverlappedTrackItem,
    findTicksOverlappedTrackItems,
    sortTrackItems,
    clearTrackItems,
    addTrackItem,
    deleteTrackItem,
    replaceTrackItem,
  }
}
