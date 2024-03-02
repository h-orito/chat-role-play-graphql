import Modal from '@/components/modal/modal'
import {
  DirectMessagesQuery,
  GameParticipantGroup
} from '@/lib/generated/graphql'
import {
  ArrowDownIcon,
  ArrowUpIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'
import { useState } from 'react'
import MessageFilter from '../message-area/message-filter'
import { isDirectMessagesQueryFiltering } from '../message-area/messages-query'
import DirectMessageFilter from './direct-message-filter'

type Props = {
  group: GameParticipantGroup
  search: (query?: DirectMessagesQuery) => Promise<void>
  query: DirectMessagesQuery
  canTalk: boolean
  scrollToTop: () => void
  scrollToBottom: () => void
}

const DirectFooterMenu = (props: Props) => {
  const { group, query, search, scrollToTop, scrollToBottom } = props
  const [isOpenFilterModal, setIsOpenFilterModal] = useState(false)
  const toggleFilterModal = (e: any) => {
    if (e.target === e.currentTarget) {
      setIsOpenFilterModal(!isOpenFilterModal)
    }
  }
  const filtering = isDirectMessagesQueryFiltering(query, group)

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
            <DirectMessageFilter
              close={toggleFilterModal}
              group={group}
              messageQuery={query}
              search={search}
            />
          </Modal>
        )}
      </div>
    </div>
  )
}

export default DirectFooterMenu
