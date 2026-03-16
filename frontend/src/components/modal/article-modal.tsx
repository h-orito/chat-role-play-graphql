import { cloneElement, useEffect } from 'react'
import Portal from './portal'
import SecondaryButton from '../button/secondary-button'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

type ModalProps = {
  target?: string
  header?: string
  close: () => void
  children: React.ReactNode
  zindex?: number
  hideFooter?: boolean
}

export default function ArticleModal({
  target = '#article',
  header,
  close,
  children,
  zindex = 50,
  hideFooter
}: ModalProps) {
  const zindexClass = `z-${zindex}`

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [close])

  return (
    <Portal target={target}>
      <div
        className={`base-background absolute inset-x-0 inset-y-0 h-full w-full overflow-y-auto text-sm ${zindexClass}`}
        role='dialog'
        aria-modal='true'
        aria-label={header}
      >
        <div className='base-border flex border-b p-2'>
          <button className='px-2' onClick={() => close()}>
            <ArrowLeftIcon className='mr-1 h-6 w-6' />
          </button>
          {header && <p className='justify-center text-xl'>{header}</p>}
        </div>
        {cloneElement(children as React.ReactElement<{ close: () => void }>, {
          close: close
        })}
        {!hideFooter && (
          <div className='base-border mt-2 flex justify-end border-t pt-2'>
            <SecondaryButton click={() => close()}>閉じる</SecondaryButton>
          </div>
        )}
      </div>
    </Portal>
  )
}
