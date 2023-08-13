type Props = {
  name: string
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
  name,
  label,
  candidates,
  selected,
  setSelected,
  disabled
}: Props) {
  return (
    <div>
      {label && <label className='block text-xs font-bold'>{label}</label>}
      <select
        name={name}
        className='rounded-sm border px-2 py-1'
        value={selected}
        onChange={(e: any) => setSelected(e.target.value)}
        disabled={disabled}
      >
        {candidates.map((candidate, index) => {
          return (
            <option key={index} value={candidate.value}>
              {candidate.label}
            </option>
          )
        })}
      </select>
    </div>
  )
}
