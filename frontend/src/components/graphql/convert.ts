export const base64ToId = (str: string): number => {
  const decodedString = atob(str)
  //   const decodedString = Buffer.from(str, 'base64').toString('utf-8')
  const regex = /:(\d+)$/
  const matches = decodedString.match(regex)
  if (matches && matches.length > 1) {
    return parseInt(matches[1])
  } else {
    return 0
  }
}

export const idToBase64 = (id: number, prefix: string): string => {
  return btoa(`${prefix}:${id}`)
}
