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
import {
  ArrowDownIcon,
  ArrowUpIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'
import Modal from '@/components/modal/modal'
import MessageFilter from './message-filter'
import {
  emptyMessageQuery,
  isFiltering,
  useMessagesQuery
} from './messages-query'

type Props = {
  className?: string
  openFavoritesModal: (messageId: string) => void
  isViewing: boolean
  existsUnread: boolean
  setExistUnread: (exist: boolean) => void
  onlyToMe?: boolean
}

export interface MessageAreaRefHandle {
  fetchLatest: () => void
  search: (query?: MessagesQuery) => void
}

const MessageArea = forwardRef<MessageAreaRefHandle, Props>(
  (props: Props, ref: any) => {
    const {
      className,
      isViewing,
      existsUnread,
      setExistUnread,
      onlyToMe = false
    } = props
    const game = useGameValue()
    const myself = useMyselfValue()

    const [fetchMessages] =
      useLazyQuery<GameMessagesQuery>(GameMessagesDocument)
    const [fetchMessagesLatest] = useLazyQuery<MessagesLatestQuery>(
      MessagesLatestDocument
    )

    const [pagingSettings] = useUserPagingSettings()
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
    const [messageQuery, setMessageQuery] = useState(emptyMessageQuery)

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
    const [initialMessagesQuery] = useMessagesQuery()
    useEffect(() => {
      const paging = {
        pageSize: pagingSettings.pageSize,
        pageNumber: 1,
        isDesc: pagingSettings.isDesc,
        isLatest: !pagingSettings.isDesc
      }
      const q = onlyToMe
        ? {
            ...emptyMessageQuery,
            recipientIds: [myself!.id],
            paging
          }
        : {
            ...initialMessagesQuery,
            paging
          }
      search(q)
    }, [])

    // 1分ごとに最新をチェックして更新されていれば取得
    const usePollingMessages = (callback: () => void) => {
      const ref = useRef<() => void>(callback)
      useEffect(() => {
        ref.current = callback
      }, [callback])

      useEffect(() => {
        const fetch = () => {
          ref.current()
        }
        const timer = setInterval(fetch, 60000)
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
      }
    }))

    const scrollToTop = () => {
      messageAreaRef?.current?.scroll({ top: 0, behavior: 'smooth' })
    }
    const scrollToBottom = () => {
      messageAreaRef?.current?.scroll({
        top: messageAreaRef?.current?.scrollHeight,
        behavior: 'smooth'
      })
    }

    const reply = (message: Message) => {
      talkAreaRef.current.reply(message)
    }

    return (
      <div
        className={`${className} mut-height-guard relative flex flex-1 flex-col overflow-y-auto`}
      >
        <div
          className={`flex flex-1 flex-col overflow-y-auto`}
          ref={messageAreaRef}
        >
          <MessagesArea
            messages={messages}
            messageQuery={messageQuery}
            canTalk={canTalk}
            search={search}
            messageAreaRef={messageAreaRef}
            reply={reply}
            searchable={!onlyToMe}
            {...props}
          />
          <TalkArea
            ref={talkAreaRef}
            {...props}
            canTalk={canTalk}
            search={search}
          />
        </div>
        <FooterMenu
          scrollToTop={scrollToTop}
          scrollToBottom={scrollToBottom}
          searchable={!onlyToMe}
          messageQuery={messageQuery}
          search={search}
        />
      </div>
    )
  }
)

export default MessageArea

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

type FooterMenuProps = {
  scrollToTop: () => void
  scrollToBottom: () => void
  searchable: boolean
  messageQuery: MessagesQuery
  search: (query: MessagesQuery) => void
}

const FooterMenu = (props: FooterMenuProps) => {
  const { scrollToTop, scrollToBottom, searchable, messageQuery, search } =
    props
  const [isOpenFilterModal, setIsOpenFilterModal] = useState(false)
  const toggleFilterModal = (e: any) => {
    if (e.target === e.currentTarget) {
      setIsOpenFilterModal(!isOpenFilterModal)
    }
  }
  const filtering = isFiltering(messageQuery, useGameValue())

  return (
    <div className='base-border flex w-full border-t text-sm'>
      <div className='flex flex-1 text-center'>
        <button
          className='sidebar-background flex w-full justify-center px-4 py-2'
          onClick={scrollToTop}
        >
          <ArrowUpIcon className='h-5 w-5' />
          <span className='my-auto ml-1 hidden text-xs md:block'>最上部へ</span>
        </button>
      </div>
      <div className='flex flex-1 text-center'>
        <button
          className='sidebar-background flex w-full justify-center px-4 py-2'
          onClick={scrollToBottom}
        >
          <ArrowDownIcon className='h-5 w-5' />
          <span className='my-auto ml-1 hidden text-xs md:block'>最下部へ</span>
        </button>
      </div>
      {searchable && (
        <div className='flex flex-1 text-center'>
          <button
            className='sidebar-background flex w-full justify-center px-4 py-2'
            onClick={() => setIsOpenFilterModal(true)}
          >
            <MagnifyingGlassIcon
              className={`h-5 w-5 ${filtering ? 'base-link' : ''}`}
            />
            <span
              className={`my-auto ml-1 hidden text-xs md:block ${
                filtering ? 'base-link' : ''
              }`}
            >
              抽出
            </span>
          </button>
          {isOpenFilterModal && (
            <Modal header='発言抽出' close={toggleFilterModal}>
              <MessageFilter
                close={toggleFilterModal}
                messageQuery={messageQuery}
                search={search}
              />
            </Modal>
          )}
        </div>
      )}
    </div>
  )
}
