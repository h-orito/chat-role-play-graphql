import {
  Game,
  GameMessagesQuery,
  GameParticipant,
  Message,
  Messages,
  MessagesLatestQuery,
  MessagesQuery,
  PageableQuery
} from '@/lib/generated/graphql'
import MessageComponent from './message'
import Paging from '../paging'
import { useEffect, useRef, useState } from 'react'
import SearchCondition from './search-condition'
import { LazyQueryExecFunction, OperationVariables } from '@apollo/client'
import { GoogleAdsense } from '@/components/adsense/google-adsense'
import GamePeriodLinks from '../game-period-links'
import Modal from '@/components/modal/modal'
import { PencilSquareIcon } from '@heroicons/react/24/outline'
import Talk from '../../../talk/talk'

type Props = {
  game: Game
  className?: string
  myself: GameParticipant | null
  fetchMessages: LazyQueryExecFunction<GameMessagesQuery, OperationVariables>
  fetchMessagesLatest: LazyQueryExecFunction<
    MessagesLatestQuery,
    OperationVariables
  >
  openProfileModal: (participantId: string) => void
  openFavoritesModal: (messageId: string) => void
  isViewing: boolean
  existsUnread: boolean
  setExistUnread: (exist: boolean) => void
  onlyFollowing?: boolean
  searchable?: boolean
}

export default function MessageArea({
  game,
  className,
  myself,
  fetchMessages,
  fetchMessagesLatest,
  openProfileModal,
  openFavoritesModal,
  isViewing,
  existsUnread,
  setExistUnread,
  onlyFollowing = false,
  searchable = false
}: Props) {
  const defaultMessageQuery: MessagesQuery = {
    senderIds: onlyFollowing
      ? [...myself!.followParticipantIds, myself!.id]
      : null,
    periodId: searchable ? null : game.periods[0].id,
    paging: {
      pageSize: 10,
      pageNumber: 1,
      isDesc: true
    }
  }

  const [messages, setMessages] = useState<Messages>({
    list: [],
    allPageCount: 0,
    hasPrePage: false,
    hasNextPage: false,
    isDesc: true,
    latestUnixTimeMilli: 0
  })
  const [latestTime, setLatestTime] = useState<number>(0)
  const [messageQuery, setMessageQuery] = useState(defaultMessageQuery)

  const search = async (query: MessagesQuery = messageQuery) => {
    const newQuery = {
      ...query
    }
    setMessageQuery(newQuery)
    const { data } = await fetchMessages({
      variables: {
        gameId: game.id,
        query: newQuery
      } as MessagesQuery
    })
    if (data?.messages == null) return
    setMessages(data.messages as Messages)
    setLatestTime(data.messages.latestUnixTimeMilli as number)
    setExistUnread(false)
  }

  const fetchLatestTime = async () => {
    if (!isViewing && existsUnread) return
    const { data } = await fetchMessagesLatest({
      variables: {
        gameId: game.id,
        query: {
          ...messageQuery,
          offsetUnixTimeMilli: latestTime
        }
      } as MessagesQuery
    })
    if (data?.messagesLatestUnixTimeMilli == null) return
    const latest = data.messagesLatestUnixTimeMilli as number
    if (latestTime < latest) {
      if (isViewing) search()
      else setExistUnread(true)
    }
  }

  // 初回の取得
  useEffect(() => {
    if (!searchable) search()
  }, [])

  // 30秒（検索タブは60秒）ごとに最新をチェックして更新されていれば取得
  const usePollingMessages = (callback: () => void) => {
    const ref = useRef<() => void>(callback)
    useEffect(() => {
      ref.current = callback
    }, [callback])

    useEffect(() => {
      const fetch = () => {
        ref.current()
      }
      const timer = setInterval(fetch, searchable ? 60000 : 30000)
      return () => clearInterval(timer)
    }, [])
  }
  usePollingMessages(() => fetchLatestTime())

  const setPeriodQuery = (periodId: string) => {
    const newQuery = {
      ...messageQuery,
      periodId
    } as MessagesQuery
    search(newQuery)
  }

  const setPageableQuery = (pageNumber: number) => {
    const newQuery = {
      ...messageQuery,
      paging: {
        ...messageQuery.paging,
        pageNumber
      } as PageableQuery
    } as MessagesQuery
    search(newQuery)
  }

  const canTalk =
    myself && ['Opening', 'Recruiting', 'Progress'].includes(game.status)

  return (
    <div
      className={`${className} mut-height-guard relative flex flex-1 flex-col overflow-y-auto`}
    >
      {searchable && (
        <div className='flex'>
          <SearchCondition
            game={game}
            myself={myself}
            messageQuery={messageQuery}
            search={search}
            onlyFollowing={onlyFollowing}
          />
        </div>
      )}
      {canTalk && <TalkButton game={game} myself={myself!} search={search} />}
      {!searchable && (
        <GamePeriodLinks
          game={game}
          periodId={messageQuery.periodId}
          setQuery={setPeriodQuery}
        />
      )}
      <Paging
        messages={messages}
        query={messageQuery.paging as PageableQuery | undefined}
        setQuery={setPageableQuery}
      />
      <div className='flex-1 overflow-y-auto'>
        {messages.list.map((message: Message) => (
          <MessageComponent
            game={game}
            message={message}
            myself={myself}
            key={message.id}
            openProfileModal={openProfileModal}
            openFavoritesModal={openFavoritesModal}
          />
        ))}
        {/* {isViewing && (
          <GoogleAdsense slot='1577139382' format='auto' responsive='true' />
        )} */}
      </div>
      <Paging
        messages={messages}
        query={messageQuery.paging as PageableQuery | undefined}
        setQuery={setPageableQuery}
      />
    </div>
  )
}

type TalkButtonProps = {
  game: Game
  myself: GameParticipant | null
  search: (query?: MessagesQuery) => void
}

const TalkButton = ({ game, myself, search }: TalkButtonProps) => {
  const [isOpenTalkModal, setIsOpenTalkModal] = useState(false)
  const toggleTalkModal = (e: any) => {
    if (e.target === e.currentTarget) {
      setIsOpenTalkModal(!isOpenTalkModal)
    }
  }
  return (
    <>
      <button
        className='absolute bottom-4 right-4 rounded-full bg-blue-400 p-3 hover:bg-slate-200'
        onClick={() => setIsOpenTalkModal(true)}
      >
        <PencilSquareIcon className='h-8 w-8' />
      </button>
      {isOpenTalkModal && (
        <Modal close={toggleTalkModal} hideFooter>
          <Talk
            game={game}
            myself={myself!}
            close={toggleTalkModal}
            search={search}
          />
        </Modal>
      )}
    </>
  )
}
