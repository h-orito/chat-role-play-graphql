import { useId } from 'react'

type Props<T extends string> = {
  className?: string
  name: string
  candidates: Array<{ label: string; value: T }>
  selected: T
  setSelected: (value: T) => void
  disabled?: boolean
}

export default function RadioGroup<T extends string>({
  className,
  name,
  candidates,
  selected,
  setSelected,
  disabled
}: Props<T>) {
  const id = useId()
  const nameWithId = `${name}_${id}`
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
          <div className='' key={candidate.value}>
            <input
              type='radio'
              name={nameWithId}
              className='size-0 opacity-0'
              value={candidate.value}
              id={`${nameWithId}_${index}`}
              checked={selected === candidate.value}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSelected(e.target.value as T)
              }
              disabled={disabled}
            />
            <label
              className={`primary-border cursor-pointer border-y px-2 py-1 ${checkedClass} ${roundClass} ${className}`}
              htmlFor={`${nameWithId}_${index}`}
            >
              {candidate.label}
            </label>
          </div>
        )
      })}
    </div>
  )
}
