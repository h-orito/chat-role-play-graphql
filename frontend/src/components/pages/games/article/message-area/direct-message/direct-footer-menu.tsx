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
import MessageFilter from '../message-area/message-filter'
import { useModal } from '@/components/hooks/use-modal'
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
  const filterModal = useModal()
  const filtering = isDirectMessagesQueryFiltering(query, group)

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
            発言抽出
          </span>
        </button>
        {filterModal.isOpen && (
          <Modal header='発言抽出' close={filterModal.close}>
            <DirectMessageFilter
              close={filterModal.close}
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
