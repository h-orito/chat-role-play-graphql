import PrimaryButton from '@/components/button/primary-button'
import CheckGroup from '@/components/form/check-group'
import Datetime from '@/components/form/datetime'
import Modal from '@/components/modal/modal'
import {
  GameParticipant,
  MessageType,
  MessagesQuery
} from '@/lib/generated/graphql'
import React, { useState } from 'react'
import { useGameValue, useMyselfValue } from '../../../game-hook'
import ParticipantsCheckbox from '../../../participant/participants-checkbox'
import { messageTypeOptions, messageTypeValues } from './message-type'
import { base64ToId } from '@/components/graphql/convert'
import Link from 'next/link'
import { toUrlQuery } from './messages-query'
import dayjs from 'dayjs'
import DangerButton from '@/components/button/danger-button'

type Props = {
  messageQuery: MessagesQuery
  search: (query: MessagesQuery) => void
  close: (e: any) => void
}

export default function MessageFilter(props: Props) {
  const { messageQuery, search, close } = props
  const game = useGameValue()
  const participants = game.participants.filter((p) => !p.isGone)

  const [types, setTypes] = useState<MessageType[]>(
    messageQuery.types || messageTypeValues
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
    messageQuery.sinceAt ? dayjs(messageQuery.sinceAt).toDate() : null
  )
  const [untilAt, setUntilAt] = useState<Date | null>(
    messageQuery.untilAt ? dayjs(messageQuery.untilAt).toDate() : null
  )

  const handleReset = (e: any) => {
    if (!window.confirm('検索条件をリセットしてよろしいですか？')) return
    setTypes(messageTypeValues)
    setSenders([])
    setReceivers([])
    setKeyword('')
    setSinceAt(null)
    setUntilAt(null)
  }

  const handleSearch = (e: any) => {
    const keywords = keyword.split(' ').filter((k) => k.length !== 0)
    const query: MessagesQuery = {
      ...messageQuery,
      types:
        types.length > 0 && types.length !== messageTypeOptions.length
          ? types
          : null,
      senderIds:
        senders.length > 0 && senders.length !== participants.length
          ? senders.map((s) => s.id)
          : null,
      recipientIds:
        receivers.length > 0 && receivers.length !== participants.length
          ? receivers.map((r) => r.id)
          : null,
      keywords: keywords.length > 0 ? keywords : null,
      sinceAt,
      untilAt,
      paging: {
        ...messageQuery.paging!,
        pageNumber: 1
      }
    }
    search(query)
    close(e)
  }

  return (
    <div className='w-full'>
      <FilterType types={types} setTypes={setTypes} />
      <FilterSender
        participants={participants}
        senders={senders}
        setSenders={setSenders}
      />
      <FilterReceiver
        participants={participants}
        receivers={receivers}
        setReceivers={setReceivers}
      />
      <FilterKeyword keyword={keyword} setKeyword={setKeyword} />
      <FilterTerms
        sinceAt={sinceAt}
        setSinceAt={setSinceAt}
        untilAt={untilAt}
        setUntilAt={setUntilAt}
      />
      <div className='mt-6 flex justify-end'>
        <DangerButton className='mr-auto' click={handleReset}>
          リセット
        </DangerButton>
        <PrimaryButton click={handleSearch}>検索</PrimaryButton>
        <NewTabFilterLink
          types={types}
          senders={senders}
          receivers={receivers}
          keyword={keyword}
          sinceAt={sinceAt}
          untilAt={untilAt}
        />
      </div>
    </div>
  )
}

type FilterTypeProps = {
  types: MessageType[]
  setTypes: (types: MessageType[]) => void
}
const FilterType = (props: FilterTypeProps) => {
  const { types, setTypes } = props
  return (
    <div className='mb-6'>
      <label className='text-sm font-bold'>種別</label>
      <div className='my-1'>
        <button
          className='base-link text-xs'
          onClick={() => setTypes(messageTypeValues)}
        >
          全選択
        </button>
        &nbsp;/&nbsp;
        <button className='base-link text-xs' onClick={() => setTypes([])}>
          全解除
        </button>
        &nbsp;/&nbsp;
        <button
          className='base-link text-xs'
          onClick={() =>
            setTypes(messageTypeValues.filter((t) => !types.includes(t)))
          }
        >
          反転
        </button>
      </div>
      <CheckGroup
        className='mt-1 text-xs'
        name='search-say-type'
        candidates={messageTypeOptions}
        selected={types}
        setSelected={setTypes}
      />
    </div>
  )
}

type FilterSenderProps = {
  participants: GameParticipant[]
  senders: GameParticipant[]
  setSenders: (senders: GameParticipant[]) => void
}

const FilterSender = (props: FilterSenderProps) => {
  const { participants, senders, setSenders } = props
  const myself = useMyselfValue()
  const [isOpenSenderModal, setIsOpenSenderModal] = useState(false)
  const toggleSenderModal = (e: any) => {
    if (e.target === e.currentTarget) {
      setIsOpenSenderModal(!isOpenSenderModal)
    }
  }
  return (
    <div className='my-6'>
      <label className='text-sm font-bold'>発言者</label>
      <div className='my-1'>
        {senders.length === 0 || senders.length === participants.length ? (
          <p className='text-xs'>全員</p>
        ) : (
          <p className='text-xs'>{senders.map((s) => s.name).join('、')}</p>
        )}
      </div>
      <PrimaryButton
        className='text-xs'
        click={() => setIsOpenSenderModal(true)}
      >
        選択
      </PrimaryButton>
      {isOpenSenderModal && (
        <Modal close={toggleSenderModal}>
          <ParticipantsCheckbox
            participants={participants}
            selects={senders}
            setSelects={setSenders}
          >
            <div>
              <button
                className='base-link text-xs'
                onClick={() => setSenders(participants)}
              >
                全選択
              </button>
              &nbsp;/&nbsp;
              <button
                className='base-link text-xs'
                onClick={() => setSenders([])}
              >
                全解除
              </button>
              &nbsp;/&nbsp;
              <button
                className='base-link text-xs'
                onClick={() =>
                  setSenders(participants.filter((t) => !senders.includes(t)))
                }
              >
                反転
              </button>
              {myself && (
                <>
                  &nbsp;/&nbsp;
                  <button
                    className='base-link text-xs'
                    onClick={() =>
                      setSenders([
                        participants.find((p) => p.id === myself.id)!
                      ])
                    }
                  >
                    自分
                  </button>
                  &nbsp;/&nbsp;
                  <button
                    className='base-link text-xs'
                    onClick={() =>
                      setSenders(
                        participants.filter((p) =>
                          myself.followParticipantIds.includes(p.id)
                        )
                      )
                    }
                  >
                    フォロー中
                  </button>
                </>
              )}
            </div>
          </ParticipantsCheckbox>
        </Modal>
      )}
    </div>
  )
}

type FilterReceiverProps = {
  participants: GameParticipant[]
  receivers: GameParticipant[]
  setReceivers: (receivers: GameParticipant[]) => void
}
const FilterReceiver = (props: FilterReceiverProps) => {
  const { participants, receivers, setReceivers } = props
  const [isOpenReceiverModal, setIsOpenReceiverModal] = useState(false)
  const toggleReceiverModal = (e: any) => {
    if (e.target === e.currentTarget) {
      setIsOpenReceiverModal(!isOpenReceiverModal)
    }
  }
  const myself = useMyselfValue()
  return (
    <div className='my-6'>
      <label className='text-sm font-bold'>宛先</label>
      <div className='my-1'>
        {receivers.length === 0 || receivers.length === participants.length ? (
          <p className='text-xs'>全員</p>
        ) : (
          <p className='text-xs'>{receivers.map((s) => s.name).join('、')}</p>
        )}
      </div>
      <PrimaryButton
        className='text-xs'
        click={() => setIsOpenReceiverModal(true)}
      >
        選択
      </PrimaryButton>
      {isOpenReceiverModal && (
        <Modal close={toggleReceiverModal}>
          <ParticipantsCheckbox
            participants={participants}
            selects={receivers}
            setSelects={setReceivers}
          >
            <div>
              <button
                className='base-link text-xs'
                onClick={() => setReceivers(participants)}
              >
                全選択
              </button>
              &nbsp;/&nbsp;
              <button
                className='base-link text-xs'
                onClick={() => setReceivers([])}
              >
                全解除
              </button>
              &nbsp;/&nbsp;
              <button
                className='base-link text-xs'
                onClick={() =>
                  setReceivers(
                    participants.filter((t) => !receivers.includes(t))
                  )
                }
              >
                反転
              </button>
              {myself && (
                <>
                  &nbsp;/&nbsp;
                  <button
                    className='base-link text-xs'
                    onClick={() =>
                      setReceivers([
                        participants.find((p) => p.id === myself.id)!
                      ])
                    }
                  >
                    自分宛
                  </button>
                </>
              )}
            </div>
          </ParticipantsCheckbox>
        </Modal>
      )}
    </div>
  )
}

type FilterKeywordProps = {
  keyword: string
  setKeyword: (keyword: string) => void
}
const FilterKeyword = (props: FilterKeywordProps) => {
  const { keyword, setKeyword } = props
  return (
    <div className='my-6'>
      <label className='text-sm font-bold'>キーワード</label>
      <div className='my-1'>
        <button className='base-link text-xs' onClick={() => setKeyword('')}>
          クリア
        </button>
      </div>
      <div>
        <input
          className='base-border w-full rounded border px-2 py-1 text-xs text-gray-700'
          value={keyword}
          placeholder='スペース区切りでOR検索'
          onChange={(e) => setKeyword(e.target.value)}
        />
      </div>
    </div>
  )
}

type FilterTermsProps = {
  sinceAt: Date | null
  setSinceAt: (sinceAt: Date | null) => void
  untilAt: Date | null
  setUntilAt: (untilAt: Date | null) => void
}
const FilterTerms = (props: FilterTermsProps) => {
  const { sinceAt, setSinceAt, untilAt, setUntilAt } = props
  return (
    <div className='my-6 flex gap-4'>
      <div>
        <label className='text-sm font-bold'>From</label>
        <div className='my-1'>
          <button
            className='base-link text-xs'
            onClick={() => setSinceAt(null)}
          >
            クリア
          </button>
          &nbsp;/&nbsp;
          <button
            className='base-link text-xs'
            onClick={() => setSinceAt(dayjs().subtract(1, 'day').toDate())}
          >
            昨日
          </button>
          &nbsp;/&nbsp;
          <button
            className='base-link text-xs'
            onClick={() => setSinceAt(dayjs().toDate())}
          >
            今日
          </button>
          &nbsp;/&nbsp;
          <button
            className='base-link text-xs'
            onClick={() => setSinceAt(dayjs(sinceAt).startOf('day').toDate())}
          >
            0時
          </button>
        </div>
        <div>
          <Datetime className='text-xs' value={sinceAt} setValue={setSinceAt} />
        </div>
      </div>
      <div>
        <label className='text-sm font-bold'>To</label>
        <div className='my-1'>
          <button
            className='base-link text-xs'
            onClick={() => setUntilAt(null)}
          >
            クリア
          </button>
          &nbsp;/&nbsp;
          <button
            className='base-link text-xs'
            onClick={() => setUntilAt(dayjs().subtract(1, 'day').toDate())}
          >
            昨日
          </button>
          &nbsp;/&nbsp;
          <button
            className='base-link text-xs'
            onClick={() => setUntilAt(dayjs().toDate())}
          >
            今日
          </button>
          &nbsp;/&nbsp;
          <button
            className='base-link text-xs'
            onClick={() => setUntilAt(dayjs(sinceAt).startOf('day').toDate())}
          >
            0時
          </button>
        </div>
        <div>
          <Datetime className='text-xs' value={untilAt} setValue={setUntilAt} />
        </div>
      </div>
    </div>
  )
}

type NewTabFilterLinkProps = {
  types: MessageType[]
  senders: GameParticipant[]
  receivers: GameParticipant[]
  keyword: string
  sinceAt: Date | null
  untilAt: Date | null
}

const NewTabFilterLink = (props: NewTabFilterLinkProps) => {
  const game = useGameValue()
  const { types, senders, receivers, keyword, sinceAt, untilAt } = props
  return (
    <Link
      href={{
        pathname: `/games/${base64ToId(game.id)}`,
        query: toUrlQuery(
          game,
          types,
          senders,
          receivers,
          keyword,
          sinceAt,
          untilAt
        )
      }}
      target='_blank'
    >
      <PrimaryButton className='ml-2' click={() => {}}>
        検索（別タブ）
      </PrimaryButton>
    </Link>
  )
}
