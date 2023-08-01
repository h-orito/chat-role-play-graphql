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
        <label className='font-bold'>検索条件</label>
        <button className='ml-auto' onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? (
            <ChevronDownIcon className='h-5 w-5' />
          ) : (
            <ChevronRightIcon className='h-5 w-5' />
          )}
        </button>
      </div>
      <div className={isOpen ? '' : 'hidden'}>
        <div className='my-4'>
          <label htmlFor=''>種別</label>
          <CheckGroup
            name='search-say-type'
            candidates={candidates}
            selected={types}
            setSelected={setTypes}
          />
        </div>
        <div className='my-4'>
          <label htmlFor=''>発言者</label>
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
        <div className='my-4'>
          <label htmlFor=''>キーワード</label>
          <input
            className='rounded border border-gray-300 px-2 py-1'
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
        <div className='my-4'>
          <label htmlFor=''>From</label>
          <Datetime value={sinceAt} setValue={setSinceAt} />
        </div>
        <div className='my-4'>
          <label htmlFor=''>To</label>
          <Datetime value={untilAt} setValue={setUntilAt} />
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
