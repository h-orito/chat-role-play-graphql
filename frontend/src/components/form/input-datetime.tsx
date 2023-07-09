import dayjs from 'dayjs'

type Props = {
  value: Date | null
  setValue: (value: Date | null) => void
}

export default function InputDatetime({ value, setValue }: Props) {
  const toDatetime = (date: Date | null) => {
    // yyyy-MM-ddThh:mm
    if (date === null) return ''
    return dayjs(date).toISOString().substring(0, 16)
  }
  const handleChange = (e: any) => {
    const str = e.target.value
    if (str === '') return setValue(null)
    else setValue(new Date(e.target.value))
  }
  return (
    <input
      className='rounded border border-gray-300 px-2 py-1'
      type='datetime-local'
      value={toDatetime(value)}
      onChange={handleChange}
    />
  )
}
