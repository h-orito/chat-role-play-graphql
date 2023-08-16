import Select, { SingleValue } from 'react-select'

type Props = {
  className?: string
  label?: string
  candidates: Array<Option>
  selected: any
  setSelected: (value: any) => void
  disabled?: boolean
}

type Option = {
  label: string
  value: any
}

export default function InputSelect({
  className,
  label,
  candidates,
  selected,
  setSelected,
  disabled
}: Props) {
  const handleChange = (value: SingleValue<Option>) => {
    setSelected(value?.value)
  }

  const defaultOptions = candidates.filter((c) => selected === c.value)

  return (
    <div>
      {label && <label className='block text-xs font-bold'>{label}</label>}
      <Select
        className={`w-64 md:w-96 ${className}`}
        defaultValue={defaultOptions}
        options={candidates}
        isSearchable
        onChange={handleChange}
        isDisabled={disabled}
      />
    </div>
  )
}
