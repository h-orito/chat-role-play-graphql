import Select, { MultiValue } from 'react-select'

type Option<T extends string> = {
  label: string
  value: T
}

type Props<T extends string> = {
  label?: string
  candidates: Array<Option<T>>
  selected: T[]
  setSelected: (value: T[]) => void
  disabled?: boolean
}

export default function InputMultiSelect<T extends string>({
  label,
  candidates,
  selected,
  setSelected,
  disabled
}: Props<T>) {
  const handleChange = (newValue: MultiValue<Option<T>>) => {
    setSelected(newValue.map((v) => v.value))
  }

  const defaultOptions = candidates.filter((c) => selected.includes(c.value))

  return (
    <div className='flex justify-center'>
      {label && <label className='block text-xs font-bold'>{label}</label>}
      <Select
        className='w-64 text-gray-700 md:w-96'
        defaultValue={defaultOptions}
        options={candidates}
        isMulti
        isSearchable
        onChange={handleChange}
        isDisabled={disabled}
      />
    </div>
  )
}
