type Props = {
  className?: string
  name: string
  candidates: Array<Option>
  selected: any
  setSelected: (value: any) => void
  disabled?: boolean
}

type Option = {
  label: string
  value: any
}

export default function RadioGroup({
  className,
  name,
  candidates,
  selected,
  setSelected,
  disabled
}: Props) {
  return (
    <div className='flex'>
      {candidates.map((candidate, index) => {
        const roundClass =
          index === 0
            ? 'rounded-l-sm border-l'
            : index === candidates.length - 1
            ? 'rounded-r-sm border-r'
            : 'border'
        const checkedClass =
          selected === candidate.value ? 'primary-active' : ''
        return (
          <div className='' key={index}>
            <input
              type='radio'
              name={name}
              className='h-0 w-0 opacity-0'
              value={candidate.value}
              id={`${name}_${index}`}
              checked={selected === candidate.value}
              onChange={(e: any) => setSelected(e.target.value)}
              disabled={disabled}
            />
            <label
              className={`primary-border cursor-pointer border-y px-2 py-1 ${checkedClass} ${roundClass} ${className}`}
              htmlFor={`${name}_${index}`}
            >
              {candidate.label}
            </label>
          </div>
        )
      })}
    </div>
  )
}
