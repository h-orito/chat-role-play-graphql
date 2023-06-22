import dayjs from 'dayjs'

export const iso2display = (iso: string) => {
  const datetime = dayjs(iso)
  return datetime.format('YYYY/MM/DD HH:mm:ss')
}
