import { forwardRef, useImperativeHandle, useRef, useState } from 'react'

type Props = {
  header: string
  children: React.ReactNode
  isOpen?: boolean
}

export interface PanelRefHandle {
  open: () => void
}

const Panel = forwardRef<PanelRefHandle, Props>((props: Props, ref: any) => {
  const { header, children, isOpen: initialOpen = true } = props
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
      <div className='base-border m-4 rounded-md border'>
        <details open={isOpen} ref={detailsRef}>
          <summary onClick={handleClick} className='cursor-pointer list-none'>
            <div className='base-border flex border-b px-3 py-2'>
              <div className='flex-1 text-lg'>{header}</div>
              {/* <button className='mr-auto text-xs'>固定</button> */}
            </div>
          </summary>
          <div className='primary-text details-content w-full p-4'>
            {children}
          </div>
        </details>
      </div>
      <style jsx>
        {`
          details[open] .details-content {
            animation: fadeIn 0.5s ease;
          }
          @keyframes fadeIn {
            0% {
              opacity: 0;
              transform: translateY(-10px);
            }
            100% {
              opacity: 1;
              transform: none;
            }
          }
        `}
      </style>
    </>
  )
})

export default Panel
