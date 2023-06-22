import { cloneElement } from 'react'
import Portal from './portal'
import SecondaryButton from '../button/scondary-button'

type ModalProps = {
  header?: string
  close: (e: any) => void
  children: React.ReactNode
  hideFooter?: boolean
}

export default function Modal({
  header,
  close,
  children,
  hideFooter
}: ModalProps) {
  return (
    <Portal>
      <div
        className='fixed inset-x-0 inset-y-0 z-50 flex items-center justify-center bg-black/60'
        onClick={close}
      >
        <div className='w-full max-w-full bg-white p-4 md:max-w-screen-md'>
          {header && (
            <p className='mb-2 border-b border-gray-300 pb-2 text-xl'>
              {header}
            </p>
          )}
          {cloneElement(children as any, {
            close: close
          })}
          {!hideFooter && (
            <div className='mt-2 flex justify-end border-t border-gray-300 pt-2'>
              <SecondaryButton click={close}>閉じる</SecondaryButton>
            </div>
          )}
        </div>
      </div>
    </Portal>
  )
}
