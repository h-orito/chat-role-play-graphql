type Props<T extends string> = {
  className?: string
  name: string
  candidates: Array<{ label: string; value: T }>
  selected: T[]
  setSelected: (value: T[]) => void
}

export default function CheckGroup<T extends string>({
  className,
  name,
  candidates,
  selected,
  setSelected
}: Props<T>) {
  const items = candidates.map((candidate) => {
    return {
      ...candidate,
      checked: selected.includes(candidate.value)
    }
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newItems = items.map((item) => {
      if (item.value === e.target.value) {
        item.checked = !item.checked
      }
      return item
    })
    setSelected(
      newItems.filter((item) => item.checked).map((item) => item.value)
    )
  }

  return (
    <div className='flex'>
      {items.map((item, index) => {
        const roundClass =
          index === 0
            ? 'rounded-l-sm border-l border-y'
            : index === candidates.length - 1
            ? 'rounded-r-sm border-r border-y'
            : 'border'
        const checkedClass = selected.includes(item.value)
          ? 'primary-active'
          : ''
        return (
          <div className={`${className}`} key={index}>
            <input
              type='checkbox'
              name={name}
              className='size-0 opacity-0'
              value={item.value}
              id={`${name}_${index}`}
              onChange={handleChange}
            />
            <label
              className={`primary-border cursor-pointer px-2 py-1 ${checkedClass} ${roundClass}`}
              htmlFor={`${name}_${index}`}
            >
              {item.label}
            </label>
          </div>
        )
      })}
    </div>
  )
}
