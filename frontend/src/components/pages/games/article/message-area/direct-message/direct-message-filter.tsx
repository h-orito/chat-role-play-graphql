import PrimaryButton from '@/components/button/primary-button'
import Datetime from '@/components/form/datetime'
import Modal from '@/components/modal/modal'
import {
  DirectMessagesQuery,
  GameParticipant,
  GameParticipantGroup
} from '@/lib/generated/graphql'
import React, { useState } from 'react'
import { useMyselfValue } from '../../../game-hook'
import ParticipantsCheckbox from '../../../participant/participants-checkbox'
import dayjs from 'dayjs'
import DangerButton from '@/components/button/danger-button'

type Props = {
  group: GameParticipantGroup
  messageQuery: DirectMessagesQuery
  search: (query: DirectMessagesQuery) => void
  close: (e: any) => void
}

export default function DirectMessageFilter(props: Props) {
  const { group, messageQuery, search, close } = props
  const participants = group.participants

  const [senders, setSenders] = useState<GameParticipant[]>(
    messageQuery.senderIds
      ? participants.filter((gp) => messageQuery.senderIds?.includes(gp.id))
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
    setSenders([])
    setKeyword('')
    setSinceAt(null)
    setUntilAt(null)
  }

  const handleSearch = (e: any) => {
    const keywords = keyword.split(' ').filter((k) => k.length !== 0)
    const newQuery: DirectMessagesQuery = {
      ...messageQuery,
      senderIds:
        senders.length > 0 && senders.length !== participants.length
          ? senders.map((s) => s.id)
          : null,
      keywords: keywords.length > 0 ? keywords : null,
      sinceAt,
      untilAt,
      paging: {
        ...messageQuery.paging!,
        pageNumber: 1
      }
    }
    search(newQuery)
    close(e)
  }

  return (
    <div className='w-full'>
      <FilterSender
        participants={participants}
        senders={senders}
        setSenders={setSenders}
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
      </div>
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
