import { Dispatch, SetStateAction } from 'react'
import Select, { MultiValue } from 'react-select'

type Props = {
  label?: string
  candidates: Array<Option>
  selected: any[]
  setSelected: Dispatch<SetStateAction<any[]>>
  disabled?: boolean
}

type Option = {
  label: string
  value: any
}

export default function InputMultiSelect({
  label,
  candidates,
  selected,
  setSelected,
  disabled
}: Props) {
  const handleChange = (newValue: MultiValue<Option>) => {
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
