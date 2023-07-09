type Props = {
  name: string
  candidates: Array<Option>
  selected: any
  setSelected: (value: any) => void
}

type Option = {
  label: string
  value: any
}

export default function RadioGroup({
  name,
  candidates,
  selected,
  setSelected
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
        const checkedClass = selected === candidate.value ? 'bg-blue-300' : ''
        return (
          <div className='' key={index}>
            <input
              type='radio'
              name={name}
              className='h-0 w-0 opacity-0'
              value={candidate.value}
              id={`${name}_${index}`}
              checked={selected === candidate.value}
              onChange={(e) => setSelected(e.target.value)}
            />
            <label
              className={`cursor-pointer border-y border-blue-500 px-2 py-1 ${checkedClass} ${roundClass}`}
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
