import { useState } from 'react'

type Props = {
  className?: string
  name: string
  candidates: Array<Option>
  selected: any[]
  setSelected: (value: any[]) => void
}

type Option = {
  label: string
  value: any
}

export default function CheckGroup({
  className,
  name,
  candidates,
  selected,
  setSelected
}: Props) {
  const items = candidates.map((candidate) => {
    return {
      ...candidate,
      checked: selected.includes(candidate.value)
    }
  })

  const handleChange = (e: any) => {
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
              className='h-0 w-0 opacity-0'
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
