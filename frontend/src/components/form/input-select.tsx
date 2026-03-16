import Select, { SingleValue } from 'react-select'

type Option<T extends string> = {
  label: string
  value: T
}

type Props<T extends string> = {
  className?: string
  label?: string
  candidates: Array<Option<T>>
  selected: T | undefined
  setSelected: (value: T) => void
  disabled?: boolean
}

export default function InputSelect<T extends string>({
  className,
  label,
  candidates,
  selected,
  setSelected,
  disabled
}: Props<T>) {
  const handleChange = (value: SingleValue<Option<T>>) => {
    if (value) setSelected(value.value)
  }

  const defaultOptions = candidates.filter((c) => selected === c.value)

  return (
    <div>
      {label && (
        <label className='base-text block text-xs font-bold'>{label}</label>
      )}
      <Select
        className={`${className ?? ''} text-gray-700`}
        defaultValue={defaultOptions}
        options={candidates}
        isSearchable
        onChange={handleChange}
        isDisabled={disabled}
      />
    </div>
  )
}
