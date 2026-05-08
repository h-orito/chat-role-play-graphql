import { cloneElement, useEffect, useState } from 'react'
import Portal from './portal'
import SecondaryButton from '../button/secondary-button'

type ModalProps = {
  header?: string
  close: () => void
  children: React.ReactNode
  hideFooter?: boolean
  hideOnClickOutside?: boolean
}

export default function Modal({
  header,
  close,
  children,
  hideFooter,
  hideOnClickOutside = true
}: ModalProps) {
  const [insideClick, setInsideClick] = useState(false)
  const onMouseDown = (e: React.MouseEvent) =>
    setInsideClick(e.target === e.currentTarget)
  const onMouseUp = (e: React.MouseEvent) => {
    if (!hideOnClickOutside) return
    if (e.target === e.currentTarget && insideClick) {
      close()
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [close])

  return (
    <Portal>
      <div
        className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 text-sm'
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        role='dialog'
        aria-modal='true'
        aria-label={header ?? 'ダイアログ'}
      >
        <div className='base-background max-h-[90vh] w-[90vw] max-w-[90vw] overflow-y-auto p-4 md:max-w-screen-md'>
          {header && (
            <p className='base-border mb-2 border-b pb-2 text-xl'>{header}</p>
          )}
          {cloneElement(children as React.ReactElement<{ close: () => void }>, {
            close: close
          })}
          {!hideFooter && (
            <div className='base-border mt-2 flex justify-end border-t pt-2'>
              <SecondaryButton click={() => close()}>閉じる</SecondaryButton>
            </div>
          )}
        </div>
      </div>
    </Portal>
  )
}
