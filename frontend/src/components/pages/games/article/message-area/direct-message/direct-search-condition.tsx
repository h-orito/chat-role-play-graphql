import {
  DirectMessagesQuery,
  Game,
  GameParticipant,
  GameParticipantGroup,
  MessageType
} from '@/lib/generated/graphql'
import { useState } from 'react'
import Datetime from '@/components/form/datetime'
import PrimaryButton from '@/components/button/primary-button'
import CheckGroup from '@/components/form/check-group'
import Modal from '@/components/modal/modal'
import { ChevronRightIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import ParticipantsCheckbox from '../../../participant/participants-checkbox'

type Props = {
  game: Game
  myself: GameParticipant | null
  group: GameParticipantGroup
  query: DirectMessagesQuery
  search: (query: DirectMessagesQuery) => void
}

const candidates = [
  {
    label: '通常',
    value: MessageType.TalkNormal
  },
  {
    label: '独り言',
    value: MessageType.Monologue
  }
]

export default function DirectSearchCondition({
  game,
  myself,
  group,
  query,
  search
}: Props) {
  const [isOpen, setIsOpen] = useState(false)

  const [types, setTypes] = useState<MessageType[]>(
    query.types || [MessageType.TalkNormal, MessageType.Monologue]
  )
  const [senders, setSenders] = useState<GameParticipant[]>(
    query.senderIds
      ? game.participants.filter((gp) => query.senderIds?.includes(gp.id))
      : []
  )
  const [keyword, setKeyword] = useState<string>(
    query.keywords ? query.keywords.join(' ') : ''
  )
  const [sinceAt, setSinceAt] = useState<Date | null>(
    query.sinceAt ? (query.sinceAt as Date) : null
  )
  const [untilAt, setUntilAt] = useState<Date | null>(
    query.untilAt ? (query.untilAt as Date) : null
  )

  const [isOpenSenderModal, setIsOpenSenderModal] = useState(false)
  const toggleSenderModal = (e: any) => {
    if (e.target === e.currentTarget) {
      setIsOpenSenderModal(!isOpenSenderModal)
    }
  }

  const handleSearch = (e: any) => {
    const keywords = keyword.split(' ').filter((k) => k.length !== 0)
    const newQuery: DirectMessagesQuery = {
      ...query,
      types:
        types.length > 0 && types.length !== candidates.length ? types : null,
      senderIds:
        senders.length > 0 && senders.length !== group.participants.length
          ? senders.map((s) => s.id)
          : null,
      keywords: keywords.length > 0 ? keywords : null,
      sinceAt,
      untilAt
    }
    search(newQuery)
  }

  return (
    <div className='w-full px-4 py-2'>
      <div className='flex'>
        <button
          className='flex w-full justify-start'
          onClick={() => setIsOpen(!isOpen)}
        >
          <p className='font-bold'>検索条件</p>
          {isOpen ? (
            <ChevronDownIcon className='ml-auto h-5 w-5' />
          ) : (
            <ChevronRightIcon className='ml-auto h-5 w-5' />
          )}
        </button>
      </div>
      <div className={isOpen ? '' : 'hidden'}>
        <div className='my-2'>
          <label className='text-xs font-bold'>種別</label>
          <CheckGroup
            className='mt-1 text-xs'
            name='direct-search-say-type'
            candidates={candidates}
            selected={types}
            setSelected={setTypes}
          />
        </div>
        <div className='my-2'>
          <label className='text-xs font-bold'>発言者</label>
          {senders.length === 0 ||
          senders.length === group.participants.length ? (
            <p>全員</p>
          ) : (
            <p>{senders.map((s) => s.name).join('、')}</p>
          )}
          <PrimaryButton click={() => setIsOpenSenderModal(true)}>
            選択
          </PrimaryButton>
        </div>
        <div className='my-2'>
          <label className='text-xs font-bold'>キーワード</label>
          <input
            className='w-full rounded border border-gray-300 px-2 py-1'
            value={keyword}
            placeholder='スペース区切りでOR検索'
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
        <div className='my-2 flex gap-4'>
          <div>
            <label className='text-xs font-bold'>From</label>
            <div>
              <Datetime
                className='text-xs'
                value={sinceAt}
                setValue={setSinceAt}
              />
            </div>
          </div>
          <div>
            <label className='text-xs font-bold'>To</label>
            <div>
              <Datetime
                className='text-xs'
                value={untilAt}
                setValue={setUntilAt}
              />
            </div>
          </div>
        </div>
        <div className='flex justify-end'>
          <PrimaryButton click={handleSearch}>検索</PrimaryButton>{' '}
        </div>
        {isOpenSenderModal && (
          <Modal close={toggleSenderModal}>
            <ParticipantsCheckbox
              participants={group.participants}
              selects={senders}
              setSelects={setSenders}
            />
          </Modal>
        )}
      </div>
    </div>
  )
}
