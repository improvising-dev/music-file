import { DeepWriteable } from '../types/writable'

export const writable = <T>(source: T) => {
  return source as DeepWriteable<T>
}
