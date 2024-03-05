import Modal from '@/components/modal/modal'
import { MessagesQuery } from '@/lib/generated/graphql'
import {
  ArrowUpIcon,
  ArrowDownIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'
import { useState } from 'react'
import { useGameValue } from '../../../game-hook'
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
  const [isOpenFilterModal, setIsOpenFilterModal] = useState(false)
  const toggleFilterModal = (e: any) => {
    if (e.target === e.currentTarget) {
      setIsOpenFilterModal(!isOpenFilterModal)
    }
  }
  const filtering = searchable && isFiltering(messageQuery!, useGameValue())

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
      {searchable && (
        <div className='flex flex-1 text-center'>
          <button
            className='sidebar-background flex w-full justify-center px-4 py-2'
            onClick={() => setIsOpenFilterModal(true)}
          >
            <MagnifyingGlassIcon
              className={`h-5 w-5 ${filtering ? 'base-link' : ''}`}
            />
            <span
              className={`my-auto ml-1 hidden text-xs md:block ${
                filtering ? 'base-link' : ''
              }`}
            >
              抽出
            </span>
          </button>
          {isOpenFilterModal && (
            <Modal header='発言抽出' close={toggleFilterModal}>
              <MessageFilter
                close={toggleFilterModal}
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
