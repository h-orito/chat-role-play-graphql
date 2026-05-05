import { useState } from 'react'

type Props = {
  header: string
  children: React.ReactNode
  isOpen?: boolean
  onToggle?: () => void
  isFixed?: boolean
  toggleFixed?: (e: React.MouseEvent) => void
}

const Panel = (props: Props) => {
  const {
    header,
    children,
    isOpen: isOpenProp = true,
    onToggle,
    isFixed = false,
    toggleFixed
  } = props

  // onToggle が渡された場合は controlled、そうでなければ uncontrolled
  const [internalOpen, setInternalOpen] = useState(isOpenProp)
  const isOpen = onToggle ? isOpenProp : internalOpen

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (onToggle) {
      onToggle()
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
          <div className='primary-text details-content w-full p-4'>
            {children}
          </div>
        </details>
      </div>
    </>
  )
}

export default Panel
