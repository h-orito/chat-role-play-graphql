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

type Enum = {
  code: string
  value: string
}

export const gameStatuses = new Map<string, string>([
  ['Closed', '公開前'],
  ['Opening', '公開中'],
  ['Recruiting', '参加者募集中'],
  ['Progress', '開催中'],
  ['Finished', '終了'],
  ['Canceled', '中止']
])

export const convertToGameStatusName = (code: string): string | null =>
  gameStatuses.get(code) || null
