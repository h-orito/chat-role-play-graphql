import {
  Game,
  GameParticipant,
  MessageType,
  MessagesQuery
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
  },
  {
    label: '秘話',
    value: MessageType.Secret
  },
  {
    label: 'ト書き',
    value: MessageType.Description
  },
  {
    label: 'システム',
    value: MessageType.SystemPublic
  }
]

export default function SearchCondition({
  game,
  myself,
  messageQuery,
  search,
  onlyFollowing
}: Props) {
  const participants = game.participants.filter((p) => !p.isGone)
  const [isOpen, setIsOpen] = useState(false)

  const [types, setTypes] = useState<MessageType[]>(
    messageQuery.types || [
      MessageType.TalkNormal,
      MessageType.Monologue,
      MessageType.Secret,
      MessageType.Description,
      MessageType.SystemPublic
    ]
  )
  const [senders, setSenders] = useState<GameParticipant[]>(
    messageQuery.senderIds
      ? participants.filter((gp) => messageQuery.senderIds?.includes(gp.id))
      : []
  )
  const [receivers, setReceivers] = useState<GameParticipant[]>(
    messageQuery.recipientIds
      ? participants.filter((gp) => messageQuery.recipientIds?.includes(gp.id))
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
  const [isOpenReceiverModal, setIsOpenReceiverModal] = useState(false)
  const toggleReceiverModal = (e: any) => {
    if (e.target === e.currentTarget) {
      setIsOpenReceiverModal(!isOpenReceiverModal)
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
        : senders.length > 0 && senders.length !== participants.length
        ? senders.map((s) => s.id)
        : null,
      recipientIds:
        receivers.length > 0 && receivers.length !== participants.length
          ? receivers.map((r) => r.id)
          : null,
      keywords: keywords.length > 0 ? keywords : null,
      sinceAt,
      untilAt
    }
    search(query)
  }

  return (
    <div className='base-border w-full border-b px-4 py-2'>
      <div className='flex'>
        <button
          className='flex w-full justify-start'
          onClick={() => setIsOpen(!isOpen)}
        >
          <p className='text-sm font-bold'>検索条件</p>
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
            name='search-say-type'
            candidates={candidates}
            selected={types}
            setSelected={setTypes}
          />
        </div>
        {!onlyFollowing && (
          <div className='my-2'>
            <label className='text-xs font-bold'>発言者</label>
            {senders.length === 0 || senders.length === participants.length ? (
              <p className='text-xs'>全員</p>
            ) : (
              <p className='text-xs'>{senders.map((s) => s.name).join('、')}</p>
            )}
            <PrimaryButton
              className='text-xs'
              click={() => setIsOpenSenderModal(true)}
            >
              選択
            </PrimaryButton>
          </div>
        )}
        <div className='my-2'>
          <label className='text-xs font-bold'>宛先</label>
          {receivers.length === 0 ||
          receivers.length === participants.length ? (
            <p className='text-xs'>全員</p>
          ) : (
            <p className='text-xs'>{receivers.map((s) => s.name).join('、')}</p>
          )}
          <PrimaryButton
            className='text-xs'
            click={() => setIsOpenReceiverModal(true)}
          >
            選択
          </PrimaryButton>
        </div>
        <div className='my-2'>
          <label className='text-xs font-bold'>キーワード</label>
          <div>
            <input
              className='base-border w-full rounded border px-2 py-1 text-xs text-gray-700'
              value={keyword}
              placeholder='スペース区切りでOR検索'
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
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
              participants={participants}
              selects={senders}
              setSelects={setSenders}
            />
          </Modal>
        )}
        {isOpenReceiverModal && (
          <Modal close={toggleReceiverModal}>
            <ParticipantsCheckbox
              participants={participants}
              selects={receivers}
              setSelects={setReceivers}
            />
          </Modal>
        )}
      </div>
    </div>
  )
}