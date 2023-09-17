import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

type Props = {
  className?: string
  value: Date | null
  setValue: (value: Date | null) => void
}

export default function Datetime({ className, value, setValue }: Props) {
  const toDatetime = (date: Date | null) => {
    // yyyy-MM-ddThh:mm
    if (date === null) return ''
    dayjs.extend(utc)
    dayjs.extend(timezone)
    // memo: toISOString.substring(0,16)だとUTCにされてしまうので自力でformat
    return dayjs(date).tz('Asia/Tokyo').format('YYYY-MM-DDTHH:mm')
  }
  const handleChange = (e: any) => {
    const str = e.target.value
    if (str === '') return setValue(null)
    else setValue(new Date(e.target.value))
  }
  return (
    <input
      className={`${
        className ?? ''
      } base-border rounded border px-2 py-1 text-gray-700`}
      type='datetime-local'
      value={toDatetime(value)}
      onChange={handleChange}
    />
  )
}
