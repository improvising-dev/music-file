export const intersection = (a: string[], b: string[]) => {
  return a.filter(Set.prototype.has, new Set(b))
}

export const hasInteraction = (a: string[], b: string[]) => {
  return intersection(a, b).length > 0
}
