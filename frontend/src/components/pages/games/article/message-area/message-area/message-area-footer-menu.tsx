import Modal from '@/components/modal/modal'
import { MessagesQuery } from '@/lib/generated/graphql'
import {
  ArrowUpIcon,
  ArrowDownIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'
import { useGameValue } from '../../../game-hook'
import { useModal } from '@/components/hooks/use-modal'
import MessageFilter from './message-filter'
import { isFiltering } from './messages-query'

type FooterMenuProps = {
  scrollToTop: () => void
  scrollToBottom: () => void
  searchable: boolean
  messageQuery?: MessagesQuery
  search?: (query: MessagesQuery) => void
}

const MessageAreaFooterMenu = (props: FooterMenuProps) => {
  const { scrollToTop, scrollToBottom, searchable, messageQuery, search } =
    props
  const filterModal = useModal()
  const game = useGameValue()
  const filtering = searchable && isFiltering(messageQuery!, game)

  return (
    <div className='base-border flex w-full border-t text-sm'>
      <div className='flex flex-1 text-center'>
        <button
          aria-label='最上部へ'
          className='sidebar-background flex w-full justify-center px-4 py-2'
          onClick={scrollToTop}
        >
          <ArrowUpIcon aria-hidden='true' className='size-5' />
          <span
            aria-hidden='true'
            className='my-auto ml-1 hidden text-xs md:block'
          >
            最上部へ
          </span>
        </button>
      </div>
      <div className='flex flex-1 text-center'>
        <button
          aria-label='最下部へ'
          className='sidebar-background flex w-full justify-center px-4 py-2'
          onClick={scrollToBottom}
        >
          <ArrowDownIcon aria-hidden='true' className='size-5' />
          <span
            aria-hidden='true'
            className='my-auto ml-1 hidden text-xs md:block'
          >
            最下部へ
          </span>
        </button>
      </div>
      {searchable && (
        <div className='flex flex-1 text-center'>
          <button
            aria-label='発言抽出'
            className='sidebar-background flex w-full justify-center px-4 py-2'
            onClick={filterModal.open}
          >
            <MagnifyingGlassIcon
              aria-hidden='true'
              className={`size-5 ${filtering ? 'base-link' : ''}`}
            />
            <span
              aria-hidden='true'
              className={`my-auto ml-1 hidden text-xs md:block ${
                filtering ? 'base-link' : ''
              }`}
            >
              抽出
            </span>
          </button>
          {filterModal.isOpen && (
            <Modal header='発言抽出' close={filterModal.close}>
              <MessageFilter
                close={filterModal.close}
                messageQuery={messageQuery!}
                search={search!}
              />
            </Modal>
          )}
        </div>
      )}
    </div>
  )
}

export default MessageAreaFooterMenu
