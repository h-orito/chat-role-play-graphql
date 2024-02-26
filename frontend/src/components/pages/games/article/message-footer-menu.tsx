import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/24/outline'

type Props = {
  className?: string
  scrollToTop: () => void
  scrollToBottom: () => void
}

const MessageFooterMenu = (props: Props) => {
  return (
    <div className={props.className}>
      <FooterMenu {...props} />
    </div>
  )
}

export default MessageFooterMenu

const FooterMenu = (props: Props) => {
  const { scrollToTop, scrollToBottom } = props

  return (
    <div className='base-border flex w-full border-t text-sm'>
      <div className='flex flex-1 text-center'>
        <button
          className='sidebar-background flex w-full justify-center px-4 py-2'
          onClick={scrollToTop}
        >
          <ArrowUpIcon className='h-5 w-5' />
          <span className='my-auto ml-1 hidden text-xs md:block'>最上部へ</span>
        </button>
      </div>
      <div className='flex flex-1 text-center'>
        <button
          className='sidebar-background flex w-full justify-center px-4 py-2'
          onClick={scrollToBottom}
        >
          <ArrowDownIcon className='h-5 w-5' />
          <span className='my-auto ml-1 hidden text-xs md:block'>最下部へ</span>
        </button>
      </div>
    </div>
  )
}
