import { useState } from 'react'

type BaseProps = {
  header: string
  children: React.ReactNode
  isFixed?: boolean
  toggleFixed?: (e: React.MouseEvent) => void
}

type ControlledProps = {
  isOpen: boolean
  onToggle: () => void
  defaultOpen?: never
}

type UncontrolledProps = {
  isOpen?: never
  onToggle?: never
  defaultOpen?: boolean
}

type Props = BaseProps & (ControlledProps | UncontrolledProps)

const Panel = (props: Props) => {
  const { header, children, isFixed = false, toggleFixed } = props

  // controlled 時は使われないが、Hooks の規則上常に呼ぶ必要がある
  const [internalOpen, setInternalOpen] = useState(props.defaultOpen ?? true)

  const isOpen = props.onToggle !== undefined ? props.isOpen : internalOpen

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (props.onToggle !== undefined) {
      props.onToggle()
    } else {
      setInternalOpen((prev) => !prev)
    }
  }

  return (
    <>
      <div className='base-border rounded-md border'>
        <details open={isOpen}>
          <summary
            onClick={handleClick}
            className='secondary-background cursor-pointer list-none rounded-t'
          >
            <div className='base-border flex border-b px-3 py-2'>
              <div className='flex-1 text-lg'>{header}</div>
              {toggleFixed && (
                <button
                  className='base-link mr-auto text-xs'
                  onClick={toggleFixed}
                >
                  {isFixed ? '固定解除' : '固定'}
                </button>
              )}
            </div>
          </summary>
          <div className='primary-text w-full p-4'>{children}</div>
        </details>
      </div>
    </>
  )
}

export default Panel
