import { cloneElement } from 'react'
import Portal from './portal'
import SecondaryButton from '../button/scondary-button'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

type ModalProps = {
  target?: string
  header?: string
  close: (e: any) => void
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
  return (
    <Portal target={target}>
      <div
        className={`base-background absolute inset-x-0 inset-y-0 h-full w-full overflow-y-auto text-sm ${zindexClass}`}
      >
        <div className='base-border flex border-b p-2'>
          <button className='px-2' onClick={close}>
            <ArrowLeftIcon className='mr-1 h-6 w-6' />
          </button>
          {header && <p className='justify-center text-xl'>{header}</p>}
        </div>
        {cloneElement(children as any, {
          close: close
        })}
        {!hideFooter && (
          <div className='base-border mt-2 flex justify-end border-t pt-2'>
            <SecondaryButton click={close}>閉じる</SecondaryButton>
          </div>
        )}
      </div>
    </Portal>
  )
}
