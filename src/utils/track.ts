import { hasInteraction } from '../common/algorithm'
import { MusicFileError } from '../common/error'
import { generateRandomId } from '../common/random'
import { NOTES, NOTE_INDEX_MAP } from '../constants/note'
import {
  MFChordTrackItem,
  MFNoteTrackItem,
  MFTrack,
  MFTrackItem,
  MFTrackItemType,
} from '../types/track'
import { getChordOctaveNotes, getChordSpan, isValidChord } from './chord'
import { buildOctaveNote, isValidNote } from './note'
import { ensureValidOctave } from './octave'

type Optional<T, P extends keyof T> = Omit<T, P> & { [K in P]?: T[K] }

export const generateTrackId = () => generateRandomId()
export const generateTrackItemId = () => generateRandomId()

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
    return track.items.sort((a, b) => {
      return a.begin < b.begin ? -1 : 1
    })
  }

  const clearTrackItems = () => {
    track.items = []
  }

  const addTrackItem = (source: MFTrackItem) => {
    if (track.items.length === 0 || track.items[0].begin > source.begin) {
      track.items.unshift(source)
    } else {
      for (let i = 0; i < track.items.length; i++) {
        if (track.items[i].begin <= source.begin) {
          track.items.splice(i, 0, source)
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
