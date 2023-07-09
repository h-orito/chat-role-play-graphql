import { cloneElement } from 'react'
import Portal from './portal'
import SecondaryButton from '../button/scondary-button'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

type ModalProps = {
  target?: string
  header?: string
  close: (e: any) => void
  children: React.ReactNode
  hideFooter?: boolean
}

export default function ArticleModal({
  target = '#article',
  header,
  close,
  children,
  hideFooter
}: ModalProps) {
  return (
    <Portal target={target}>
      <div className='absolute inset-x-0 inset-y-0 z-50 h-full w-full overflow-y-auto bg-white text-sm'>
        <div className='flex border-b border-gray-300 p-2'>
          <button className='px-2' onClick={close}>
            <ArrowLeftIcon className='mr-1 h-6 w-6' />
          </button>
          {header && <p className='justify-center text-xl'>{header}</p>}
        </div>
        {cloneElement(children as any, {
          close: close
        })}
        {!hideFooter && (
          <div className='mt-2 flex justify-end border-t border-gray-300 pt-2'>
            <SecondaryButton click={close}>閉じる</SecondaryButton>
          </div>
        )}
      </div>
    </Portal>
  )
}
