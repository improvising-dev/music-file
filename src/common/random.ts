export const generateRandomId = () => {
  return Math.round(Date.now() + Math.random() * 1000000000000).toString(36)
}
