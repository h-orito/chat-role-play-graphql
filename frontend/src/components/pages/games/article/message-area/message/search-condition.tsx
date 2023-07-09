import {
  Game,
  GameParticipant,
  MessageType,
  MessagesQuery
} from '@/lib/generated/graphql'
import { useState } from 'react'
import InputDatetime from '@/components/form/input-datetime'
import PrimaryButton from '@/components/button/primary-button'
import CheckGroup from '@/components/form/check-group'
import Modal from '@/components/modal/modal'
import { ChevronRightIcon, ChevronDownIcon } from '@heroicons/react/24/outline'

type Props = {
  game: Game
  myself: GameParticipant | null
  messageQuery: MessagesQuery
  search: (query: MessagesQuery) => void
  onlyFollowing?: boolean
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

export default function SearchCondition({
  game,
  myself,
  messageQuery,
  search,
  onlyFollowing
}: Props) {
  const [isOpen, setIsOpen] = useState(false)

  const [types, setTypes] = useState<MessageType[]>(
    messageQuery.types || [MessageType.TalkNormal, MessageType.Monologue]
  )
  const [senders, setSenders] = useState<GameParticipant[]>(
    messageQuery.senderIds
      ? game.participants.filter((gp) =>
          messageQuery.senderIds?.includes(gp.id)
        )
      : []
  )
  const [keyword, setKeyword] = useState<string>(
    messageQuery.keywords ? messageQuery.keywords.join(' ') : ''
  )
  const [sinceAt, setSinceAt] = useState<Date | null>(
    messageQuery.sinceAt ? (messageQuery.sinceAt as Date) : null
  )
  const [untilAt, setUntilAt] = useState<Date | null>(
    messageQuery.untilAt ? (messageQuery.untilAt as Date) : null
  )

  const [isOpenSenderModal, setIsOpenSenderModal] = useState(false)
  const toggleSenderModal = (e: any) => {
    if (e.target === e.currentTarget) {
      setIsOpenSenderModal(!isOpenSenderModal)
    }
  }

  const handleSearch = (e: any) => {
    const keywords = keyword.split(' ').filter((k) => k.length !== 0)
    const query: MessagesQuery = {
      ...messageQuery,
      types:
        types.length > 0 && types.length !== candidates.length ? types : null,
      senderIds: onlyFollowing
        ? myself!.followParticipantIds
        : senders.length > 0 && senders.length !== game.participants.length
        ? senders.map((s) => s.id)
        : null,
      keywords: keywords.length > 0 ? keywords : null,
      sinceAt,
      untilAt
    }
    search(query)
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
        {!onlyFollowing && (
          <div className='my-4'>
            <label htmlFor=''>発言者</label>
            {senders.length === 0 ||
            senders.length === game.participants.length ? (
              <p>全員</p>
            ) : (
              <p>{senders.map((s) => s.name).join('、')}</p>
            )}
            <PrimaryButton click={() => setIsOpenSenderModal(true)}>
              選択
            </PrimaryButton>
          </div>
        )}
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
          <InputDatetime value={sinceAt} setValue={setSinceAt} />
        </div>
        <div className='my-4'>
          <label htmlFor=''>To</label>
          <InputDatetime value={untilAt} setValue={setUntilAt} />
        </div>
        <div className='flex justify-end'>
          <PrimaryButton click={handleSearch}>検索</PrimaryButton>{' '}
        </div>
        {isOpenSenderModal && (
          <Modal close={toggleSenderModal}>
            <SenderSelect
              game={game}
              senders={senders}
              setSenders={setSenders}
              toggle={() => setIsOpenSenderModal(false)}
            />
          </Modal>
        )}
      </div>
    </div>
  )
}

type SenderSelectProps = {
  game: Game
  senders: GameParticipant[]
  setSenders: (senders: GameParticipant[]) => void
  toggle: () => void
}

const SenderSelect = ({
  game,
  senders,
  setSenders,
  toggle
}: SenderSelectProps) => {
  return (
    <div>
      {game.participants.map((gp) => (
        <div key={gp.id} className='flex items-center'>
          <input
            id={`search-sender-${gp.id}`}
            type='checkbox'
            className='mr-2'
            checked={senders.includes(gp)}
            onChange={() => {
              if (senders.includes(gp)) {
                setSenders(senders.filter((s) => s.id !== gp.id))
              } else {
                setSenders([...senders, gp])
              }
            }}
          />
          <label htmlFor={`search-sender-${gp.id}`}>{gp.name}</label>
        </div>
      ))}
    </div>
  )
}
