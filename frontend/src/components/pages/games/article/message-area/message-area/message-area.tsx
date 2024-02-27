import {
  GameMessagesDocument,
  GameMessagesQuery,
  Message,
  Messages,
  MessagesLatestDocument,
  MessagesLatestQuery,
  MessagesQuery
} from '@/lib/generated/graphql'
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState
} from 'react'
import SearchCondition from './search-condition'
import { useLazyQuery } from '@apollo/client'
import { useUserPagingSettings } from '@/components/pages/games/user-settings'
import MessagesArea from './messages-area/messages-area'
import {
  useGameValue,
  useMyselfValue
} from '@/components/pages/games/game-hook'
import Talk, { TalkRefHandle } from '../../../talk/talk'
import TalkDescription from '../../../talk/talk-description'
import Panel, { PanelRefHandle } from '@/components/panel/panel'

type Props = {
  className?: string
  openFavoritesModal: (messageId: string) => void
  isViewing: boolean
  existsUnread: boolean
  setExistUnread: (exist: boolean) => void
  onlyFollowing?: boolean
  searchable?: boolean
}

export interface MessageAreaRefHandle {
  fetchLatest: () => void
  search: (query?: MessagesQuery) => void
  scrollToTop: () => void
  scrollToBottom: () => void
}

const MessageArea = forwardRef<MessageAreaRefHandle, Props>(
  (props: Props, ref: any) => {
    const {
      className,
      isViewing,
      existsUnread,
      setExistUnread,
      onlyFollowing = false,
      searchable = false
    } = props
    const game = useGameValue()
    const myself = useMyselfValue()

    const [fetchMessages] =
      useLazyQuery<GameMessagesQuery>(GameMessagesDocument)
    const [fetchMessagesLatest] = useLazyQuery<MessagesLatestQuery>(
      MessagesLatestDocument
    )

    const [pagingSettings] = useUserPagingSettings()
    const defaultMessageQuery: MessagesQuery = {
      senderIds: onlyFollowing
        ? [...myself!.followParticipantIds, myself!.id]
        : null,
      recipientIds: null,
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

    const messageAreaRef = useRef<HTMLDivElement>(null)
    const talkAreaRef = useRef({} as TalkAreaRefHandle)

    useImperativeHandle(ref, () => ({
      async fetchLatest() {
        return await search()
      },
      search(query: MessagesQuery = messageQuery) {
        return search(query)
      },
      scrollToTop() {
        messageAreaRef?.current?.scroll({ top: 0, behavior: 'smooth' })
      },
      scrollToBottom() {
        messageAreaRef?.current?.scroll({
          top: messageAreaRef?.current?.scrollHeight,
          behavior: 'smooth'
        })
      }
    }))

    const reply = (message: Message) => {
      talkAreaRef.current.reply(message)
    }

    return (
      <div
        className={`${className} mut-height-guard relative flex flex-1 flex-col overflow-y-auto`}
        ref={messageAreaRef}
      >
        <SearchArea messageQuery={messageQuery} search={search} {...props} />
        <MessagesArea
          messages={messages}
          messageQuery={messageQuery}
          canTalk={canTalk}
          search={search}
          messageAreaRef={messageAreaRef}
          reply={reply}
          {...props}
        />
        <TalkArea
          ref={talkAreaRef}
          {...props}
          canTalk={canTalk}
          search={search}
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

interface TalkAreaRefHandle {
  reply: (message: Message) => void
}

const TalkArea = forwardRef<
  TalkAreaRefHandle,
  { canTalk: boolean; search: (query?: MessagesQuery) => void }
>(({ canTalk, search }, ref: any) => {
  const talkPanelRef = useRef({} as TalkAreaRefHandle)

  useImperativeHandle(ref, () => ({
    reply(message: Message) {
      talkPanelRef.current.reply(message)
    }
  }))

  if (!canTalk) return <></>

  return (
    <div className='base-border w-full border-t text-sm'>
      <TalkPanel search={search} ref={talkPanelRef} />
      <DescriptionPanel search={search} />
    </div>
  )
})

const TalkPanel = forwardRef<
  TalkAreaRefHandle,
  { search: (query?: MessagesQuery) => void }
>(({ search }, ref: any) => {
  const talkRef = useRef({} as TalkRefHandle)
  const panelRef = useRef({} as PanelRefHandle)
  const panelWrapperRef = useRef<HTMLDivElement>(null)

  useImperativeHandle(ref, () => ({
    reply(message: Message) {
      panelRef.current.open()
      talkRef.current.replyTo(message)
      panelWrapperRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }))

  const handleTalkCompleted = () => {
    search()
  }

  return (
    <div ref={panelWrapperRef}>
      <Panel header='発言' ref={panelRef}>
        <Talk handleCompleted={handleTalkCompleted} ref={talkRef} />
      </Panel>
    </div>
  )
})

const DescriptionPanel = ({
  search
}: {
  search: (query?: MessagesQuery) => void
}) => {
  const handleDescriptionCompleted = () => {
    search()
  }

  return (
    <Panel header='ト書き'>
      <TalkDescription handleCompleted={handleDescriptionCompleted} />
    </Panel>
  )
}
