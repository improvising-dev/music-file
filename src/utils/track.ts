import { MusicFileError } from '../common/error'
import { MFTrack, MFTrackItem, MFTrackItemType } from '../types/track'
import { isValidChord } from './chord'
import { isValidNote } from './note'

export const generateTrackId = () => Date.now().toString()
export const generateTrackItemId = () => Date.now().toString()

export const isTrackItemTypeNote = (
  item: MFTrackItem,
): item is MFTrackItemType.Note => {
  return isValidNote(item.name)
}

export const isTrackItemTypeChord = (
  item: MFTrackItem,
): item is MFTrackItemType.Chord => {
  return isValidChord(item.name)
}

export const ensureTrackItemTypeNote = (item: MFTrackItem) => {
  if (!isTrackItemTypeNote(item)) {
    throw new MusicFileError(`${item.name} is not a valid note`)
  }

  return item
}

export const ensureTrackItemTypeChord = (item: MFTrackItem) => {
  if (!isTrackItemTypeChord(item)) {
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
  if (isTrackItemTypeNote(item)) {
    return 'note'
  }

  if (isTrackItemTypeChord(item)) {
    return 'chord'
  }

  throw new MusicFileError(`${item.name} is not a valid type`)
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
