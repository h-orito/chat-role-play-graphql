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
import {
  MutableRefObject,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState
} from 'react'
import SearchCondition from './search-condition'
import { LazyQueryExecFunction, OperationVariables } from '@apollo/client'
import GamePeriodLinks from '../game-period-links'
import Modal from '@/components/modal/modal'
import { DocumentTextIcon, PencilSquareIcon } from '@heroicons/react/24/outline'
import Talk, { TalkRefHandle } from '../../../talk/talk'
import { GoogleAdsense } from '@/components/adsense/google-adsense'
import TalkDescription from '../../../talk/talk-description'
import { useUserPagingSettings } from '../../../user-settings'

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

export interface MessageAreaRefHandle {
  fetchLatest: () => void
}

const MessageArea = forwardRef<MessageAreaRefHandle, Props>(
  (props: Props, ref: any) => {
    const {
      game,
      className,
      myself,
      fetchMessages,
      fetchMessagesLatest,
      isViewing,
      existsUnread,
      setExistUnread,
      onlyFollowing = false,
      searchable = false
    } = props

    const [pagingSettings] = useUserPagingSettings()
    const defaultMessageQuery: MessagesQuery = {
      senderIds: onlyFollowing
        ? [...myself!.followParticipantIds, myself!.id]
        : null,
      periodId: searchable ? null : game.periods[game.periods.length - 1].id,
      paging: {
        pageSize: pagingSettings.pageSize,
        pageNumber: 1,
        isDesc: pagingSettings.isDesc,
        isLatest: !pagingSettings.isDesc
      }
    }
    const defaultMessages: Messages = {
      list: [],
      allPageCount: 0,
      hasPrePage: false,
      hasNextPage: false,
      isDesc: pagingSettings.isDesc,
      isLatest: !pagingSettings.isDesc,
      latestUnixTimeMilli: 0
    }

    const [messages, setMessages] = useState<Messages>(defaultMessages)
    const [latestTime, setLatestTime] = useState<number>(0)
    const [messageQuery, setMessageQuery] = useState(defaultMessageQuery)

    useImperativeHandle(ref, () => ({
      async fetchLatest() {
        return await search()
      }
    }))

    const search = async (query: MessagesQuery = messageQuery) => {
      setMessageQuery(query)
      const { data } = await fetchMessages({
        variables: {
          gameId: game.id,
          query: query
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

    const canTalk =
      !!myself &&
      ['Closed', 'Opening', 'Recruiting', 'Progress', 'Epilogue'].includes(
        game.status
      )

    const talkButtonRef = useRef({} as TalkButtonRefHandle)

    return (
      <div
        className={`${className} mut-height-guard relative flex flex-1 flex-col overflow-y-auto`}
      >
        <SearchArea messageQuery={messageQuery} search={search} {...props} />
        {canTalk && (
          <>
            <DescriptionButton game={game} myself={myself!} search={search} />
            <TalkButton
              game={game}
              myself={myself!}
              search={search}
              ref={talkButtonRef}
            />
          </>
        )}
        <MessagesArea
          messages={messages}
          messageQuery={messageQuery}
          canTalk={canTalk}
          search={search}
          talkButtonRef={talkButtonRef}
          {...props}
        />
      </div>
    )
  }
)

export default MessageArea

const SearchArea = (
  props: Props & {
    messageQuery: MessagesQuery
    search: (query?: MessagesQuery) => void
  }
) => {
  const { messageQuery, search, searchable } = props
  if (!searchable) return <></>
  return (
    <div className='flex'>
      <SearchCondition {...props} messageQuery={messageQuery} search={search} />
    </div>
  )
}

const MessagesArea = (
  props: Props & {
    messageQuery: MessagesQuery
    messages: Messages
    canTalk: boolean
    search: (query?: MessagesQuery) => void
    talkButtonRef: MutableRefObject<TalkButtonRefHandle>
  }
) => {
  const {
    game,
    messages,
    messageQuery,
    searchable,
    search,
    onlyFollowing,
    canTalk,
    talkButtonRef
  } = props
  const messageAreaRef = useRef(null)

  const setPeriodQuery = (periodId: string) => {
    const newQuery = {
      ...messageQuery,
      periodId,
      paging: {
        // 期間移動したら1ページ目に戻す
        ...messageQuery.paging,
        pageNumber: 1,
        isLatest: false
      } as PageableQuery
    } as MessagesQuery
    search(newQuery)
  }

  const setPageableQuery = (q: PageableQuery) => {
    const newQuery = {
      ...messageQuery,
      paging: q
    } as MessagesQuery
    search(newQuery)
  }

  const handleReply = (message: Message) => {
    if (!canTalk || !talkButtonRef.current) return
    talkButtonRef.current.reply(message)
  }

  return (
    <div className='overflow-y-auto' ref={messageAreaRef}>
      <GamePeriodLinksArea
        {...props}
        messageQuery={messageQuery}
        search={search}
      />
      <Paging
        messages={messages}
        query={messageQuery.paging as PageableQuery | undefined}
        setPageableQuery={setPageableQuery}
        messageAreaRef={messageAreaRef}
      />
      <div className='relative flex-1 pb-12'>
        {messages.list.map((message: Message) => (
          <MessageComponent
            {...props}
            message={message}
            key={message.id}
            handleReply={handleReply}
            shouldDisplayReplyTo={true}
          />
        ))}
        {!onlyFollowing && !searchable && (
          <div className='p-4'>
            <GoogleAdsense slot='1577139382' format='auto' responsive='true' />
          </div>
        )}
      </div>
      <Paging
        messages={messages}
        query={messageQuery.paging as PageableQuery | undefined}
        setPageableQuery={setPageableQuery}
        messageAreaRef={messageAreaRef}
      />
    </div>
  )
}

const GamePeriodLinksArea = (
  props: Props & {
    messageQuery: MessagesQuery
    search: (query?: MessagesQuery) => void
  }
) => {
  const { game, messageQuery, search, searchable } = props

  const setPeriodQuery = (periodId: string) => {
    const newQuery = {
      ...messageQuery,
      periodId,
      paging: {
        // 期間移動したら1ページ目に戻す
        ...messageQuery.paging,
        pageNumber: 1,
        isLatest: false
      } as PageableQuery
    } as MessagesQuery
    search(newQuery)
  }

  if (searchable) return <></>
  return (
    <GamePeriodLinks
      game={game}
      periodId={messageQuery.periodId}
      setQuery={setPeriodQuery}
    />
  )
}

type TalkButtonProps = {
  game: Game
  myself: GameParticipant | null
  search: (query?: MessagesQuery) => void
}

export interface TalkButtonRefHandle {
  reply: (message: Message) => void
}

const TalkButton = forwardRef<TalkButtonRefHandle, TalkButtonProps>(
  (props: TalkButtonProps, ref: any) => {
    const { game, myself, search } = props
    const [isOpenTalkModal, setIsOpenTalkModal] = useState(false)
    const talkRef = useRef({} as TalkRefHandle)
    const toggleTalkModal = (e: any) => {
      if (e.target === e.currentTarget) {
        const shouldWarning =
          talkRef.current && talkRef.current.shouldWarnClose()
        if (
          shouldWarning &&
          !window.confirm('発言内容が失われますが、閉じてよろしいですか？')
        )
          return
        closeModal()
      }
    }
    const closeModal = () => {
      setIsOpenTalkModal(false)
      setReplyTarget(null)
    }
    const [replyTarget, setReplyTarget] = useState<Message | null>(null)
    useImperativeHandle(ref, () => ({
      reply(message: Message) {
        setReplyTarget(message)
        setIsOpenTalkModal(true)
      }
    }))
    return (
      <>
        <button
          className='primary-active absolute bottom-10 right-4 z-10 rounded-full p-3 hover:bg-slate-200'
          onClick={() => setIsOpenTalkModal(true)}
        >
          <PencilSquareIcon className='h-8 w-8' />
        </button>
        {isOpenTalkModal && (
          <Modal close={toggleTalkModal} hideFooter>
            <Talk
              game={game}
              myself={myself!}
              closeWithoutWarning={() => closeModal()}
              search={search}
              replyTarget={replyTarget}
              ref={talkRef}
            />
          </Modal>
        )}
      </>
    )
  }
)

type DescriptionButtonProps = {
  game: Game
  myself: GameParticipant | null
  search: (query?: MessagesQuery) => void
}

const DescriptionButton = ({
  game,
  myself,
  search
}: DescriptionButtonProps) => {
  const [isOpenModal, setIsOpenModal] = useState(false)
  const talkRef = useRef({} as TalkRefHandle)
  const toggleModal = (e: any) => {
    if (e.target === e.currentTarget) {
      const shouldWarning = talkRef.current && talkRef.current.shouldWarnClose()
      if (
        shouldWarning &&
        !window.confirm('発言内容が失われますが、閉じてよろしいですか？')
      )
        return
      setIsOpenModal(!isOpenModal)
    }
  }
  return (
    <>
      <button
        className='primary-active absolute bottom-10 right-24 z-10 rounded-full p-3 hover:bg-slate-200'
        onClick={() => setIsOpenModal(true)}
      >
        <DocumentTextIcon className='h-8 w-8' />
      </button>
      {isOpenModal && (
        <Modal close={toggleModal} hideFooter>
          <TalkDescription
            game={game}
            myself={myself!}
            closeWithoutWarning={() => setIsOpenModal(false)}
            search={search}
            ref={talkRef}
          />
        </Modal>
      )}
    </>
  )
}
