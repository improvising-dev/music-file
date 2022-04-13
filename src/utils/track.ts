import { MusicFileError } from '../common/error'
import { NOTES, NOTE_INDEX_MAP } from '../constants/note'
import {
  MFTrack,
  MFTrackItem,
  MFNoteTrackItem,
  MFChordTrackItem,
} from '../types/track'
import { isValidChord } from './chord'
import { isValidNote } from './note'
import { ensureValidOctave } from './octave'

export const generateTrackId = () => Date.now().toString()
export const generateTrackItemId = () => Date.now().toString()

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

export const isTrackItemOverlap = (a: MFTrackItem, b: MFTrackItem) => {
  if (a.id === b.id || a.octave !== b.octave || a.name !== b.name) {
    return false
  }

  const rangeA = [a.begin, a.begin + a.duration]
  const rangeB = [b.begin, b.begin + b.duration]

  return (
    (rangeA[0] <= rangeB[0] && rangeA[1] > rangeB[0]) ||
    (rangeB[0] <= rangeA[0] && rangeB[1] > rangeA[0])
  )
}

export const buildTrack = ({
  id,
  metadata,
  items = [],
}: Omit<MFTrack, 'id'> & { id?: string }): MFTrack => {
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
}: Omit<MFTrackItem, 'id'> & { id?: string }): MFTrackItem => {
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

export const getTrackItemType = (item: MFTrackItem) => {
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
    const name = index >= 0 ? NOTES[index % 12] : NOTES[12 + (index % 12)]
    const delta = index >= 0 ? Math.floor(index / 12) : Math.ceil(index / 12)
    const octave = ensureValidOctave(item.octave + delta)

    return buildTrackItem({
      id: item.id,
      name,
      octave,
      begin: item.begin,
      duration: item.duration,
    })
  } else {
    // TODO: move chord
    return item
  }
}

export const getTrackOps = (track: MFTrack) => {
  const findOverlayTrackItem = (source: MFTrackItem) => {
    return track.items.find(item => isTrackItemOverlap(source, item))
  }

  const sortTrackItems = () => {
    track.items.sort((a, b) => {
      return a.begin < b.begin ? -1 : 1
    })
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
    findOverlayTrackItem,
    sortTrackItems,
    addTrackItem,
    deleteTrackItem,
    replaceTrackItem,
  }
}
