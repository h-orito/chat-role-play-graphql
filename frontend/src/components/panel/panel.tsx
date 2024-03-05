import { forwardRef, useImperativeHandle, useRef, useState } from 'react'

type Props = {
  header: string
  children: React.ReactNode
  isOpen?: boolean
  isFixed?: boolean
  toggleFixed?: (e: any) => void
}

export interface PanelRefHandle {
  open: () => void
}

const Panel = forwardRef<PanelRefHandle, Props>((props: Props, ref: any) => {
  const {
    header,
    children,
    isOpen: initialOpen = true,
    isFixed = false,
    toggleFixed
  } = props
  const [isOpen, setIsOpen] = useState(initialOpen)

  const detailsRef = useRef<HTMLDetailsElement>(null)

  useImperativeHandle(ref, () => ({
    open() {
      setIsOpen(true)
    }
  }))

  // こうしないとdetails要素のopen属性が変更されない
  const handleClick = (e: any) => {
    e.preventDefault()
    setIsOpen(!isOpen)
  }

  return (
    <>
      <div className='base-border rounded-md border'>
        <details open={isOpen} ref={detailsRef}>
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
})

export default Panel
