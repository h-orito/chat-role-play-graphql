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
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} from 'react'
import { useLazyQuery } from '@apollo/client'
import MessagesArea, {
  MessagesAreaRefHandle
} from './messages-area/messages-area'
import {
  talkableGameStatuses,
  useFixedBottom,
  useGameValue,
  useMyPlayerValue,
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
import TalkSystem from '../../../talk/talk-system'
import Portal from '@/components/modal/portal'
import { useUserPagingSettings } from '../../../user-settings'

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

    const [messageQuery, setMessageQuery] = useState(emptyMessageQuery)

    const [fetchMessages] =
      useLazyQuery<GameMessagesQuery>(GameMessagesDocument)
    const search = useCallback(
      async (query: MessagesQuery = messageQuery) => {
        setMessageQuery(query)
        const { data } = await fetchMessages({
          variables: {
            gameId: game.id,
            query: query
          } as MessagesQuery
        })
        if (data?.messages == null) return
        messagesAreaRef.current?.setMessages(data.messages as Messages)
        messagesAreaRef.current?.setLatestTime(
          data.messages.latestUnixTimeMilli as number
        )
        setExistUnread(false)
      },
      [game.id, messageQuery]
    )

    // 初回の取得
    const [initialMessagesQuery] = useMessagesQuery()
    const [pagingSettings] = useUserPagingSettings()
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

    const canTalk = useMemo(() => {
      return !!myself && talkableGameStatuses.includes(game.status)
    }, [myself, game.status])

    const messagesAreaRef = useRef({} as MessagesAreaRefHandle)
    const talkAreaRef = useRef({} as TalkAreaRefHandle)

    useImperativeHandle(ref, () => ({
      async fetchLatest() {
        return await search()
      },
      search(query: MessagesQuery = messageQuery) {
        return search(query)
      }
    }))

    const reply = (message: Message) => {
      talkAreaRef.current.reply(message)
    }

    const messageAreaId = useMemo(
      () => `message-area-${onlyToMe ? 'tome' : 'home'}`,
      [onlyToMe]
    )
    const talkAreaId = useMemo(
      () => `talk-area-${onlyToMe ? 'tome' : 'home'}`,
      [onlyToMe]
    )

    const scrollToTop = () => {
      document.getElementById(messageAreaId)!.scroll({
        top: 0,
        behavior: 'smooth'
      })
    }

    const scrollToBottom = useCallback(() => {
      const messageAreaElement = document.getElementById(messageAreaId)!
      messageAreaElement.scroll({
        top: messageAreaElement.scrollHeight,
        behavior: 'smooth'
      })
    }, [messageAreaId])

    return (
      <div
        className={`${className} mut-height-guard relative flex flex-1 flex-col overflow-y-auto`}
      >
        <div
          id={messageAreaId}
          className={`flex flex-1 flex-col overflow-y-auto`}
        >
          <MessagesArea
            ref={messagesAreaRef}
            messageQuery={messageQuery}
            openFavoritesModal={props.openFavoritesModal}
            canTalk={canTalk}
            search={search}
            reply={reply}
            searchable={!onlyToMe}
            talkAreaId={talkAreaId}
            scrollToTop={scrollToTop}
            isViewing={isViewing}
            existsUnread={existsUnread}
            setExistsUnread={setExistUnread}
          />
          <TalkArea
            ref={talkAreaRef}
            canTalk={canTalk}
            search={search}
            talkAreaId={talkAreaId}
          />
        </div>
        <div id={`${talkAreaId}-fixed`}></div>
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

type TalkAreaProps = {
  canTalk: boolean
  search: (query?: MessagesQuery) => void
  talkAreaId: string
}

interface TalkAreaRefHandle {
  reply: (message: Message) => void
}

const TalkArea = memo(
  forwardRef<TalkAreaRefHandle, TalkAreaProps>(
    (props: TalkAreaProps, ref: any) => {
      const { canTalk, search, talkAreaId } = props
      const talkPanelRef = useRef({} as TalkAreaRefHandle)

      useImperativeHandle(ref, () => ({
        reply(message: Message) {
          talkPanelRef.current.reply(message)
        }
      }))

      if (!canTalk) return <></>

      return (
        <div id={talkAreaId} className='base-border w-full border-t text-sm'>
          <TalkPanel
            search={search}
            talkAreaId={talkAreaId}
            ref={talkPanelRef}
          />
          <DescriptionPanel talkAreaId={talkAreaId} search={search} />
          <SystemMessagePanel talkAreaId={talkAreaId} search={search} />
        </div>
      )
    }
  )
)

type TalkPanelProps = {
  search: (query?: MessagesQuery) => void
  talkAreaId: string
}

const TalkPanel = forwardRef<TalkAreaRefHandle, TalkPanelProps>(
  (props: TalkPanelProps, ref: any) => {
    const { search, talkAreaId } = props
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

    const [isFixed, setIsFixed] = useState(false)
    const otherFixedCanceler = useFixedBottom()
    const toggleFixed = (e: any) => {
      if (!isFixed) {
        otherFixedCanceler(() => setIsFixed(false))
      }
      setIsFixed((current) => !current)
      e.stopPropagation()
    }

    const PanelComponent = () => (
      <div ref={panelWrapperRef}>
        <Panel
          header='発言'
          ref={panelRef}
          toggleFixed={toggleFixed}
          isFixed={isFixed}
        >
          <Talk
            handleCompleted={handleTalkCompleted}
            talkAreaId={talkAreaId}
            ref={talkRef}
          />
        </Panel>
      </div>
    )

    if (!isFixed) {
      return <PanelComponent />
    } else {
      return (
        <Portal target={`#${talkAreaId}-fixed`}>
          <div className='-m-4 max-h-[40vh] overflow-y-scroll md:max-h-full md:overflow-y-hidden'>
            <PanelComponent />
          </div>
        </Portal>
      )
    }
  }
)

const DescriptionPanel = ({
  search,
  talkAreaId
}: {
  search: (query?: MessagesQuery) => void
  talkAreaId: string
}) => {
  const handleDescriptionCompleted = () => {
    search()
  }

  const [isFixed, setIsFixed] = useState(false)
  const otherFixedCanceler = useFixedBottom()
  const toggleFixed = (e: any) => {
    if (!isFixed) {
      otherFixedCanceler(() => setIsFixed(false))
    }
    setIsFixed((current) => !current)
    e.stopPropagation()
  }

  const PanelComponent = () => (
    <Panel header='ト書き' toggleFixed={toggleFixed} isFixed={isFixed}>
      <TalkDescription
        handleCompleted={handleDescriptionCompleted}
        talkAreaId={talkAreaId}
      />
    </Panel>
  )

  if (!isFixed) {
    return <PanelComponent />
  } else {
    return (
      <Portal target={`#${talkAreaId}-fixed`}>
        <div className='-m-4 max-h-[40vh] overflow-y-scroll md:max-h-full md:overflow-y-hidden'>
          <PanelComponent />
        </div>
      </Portal>
    )
  }
}

const SystemMessagePanel = ({
  search,
  talkAreaId
}: {
  search: (query?: MessagesQuery) => void
  talkAreaId: string
}) => {
  const game = useGameValue()
  const myPlayer = useMyPlayerValue()

  const isGameMaster =
    myPlayer?.authorityCodes.includes('AuthorityAdmin') ||
    game.gameMasters.some((gm) => gm.player.id === myPlayer?.id)

  const canModify = [
    'Closed',
    'Opening',
    'Recruiting',
    'Progress',
    'Epilogue'
  ].includes(game.status)

  const handleCompleted = () => {
    search()
  }

  const [isFixed, setIsFixed] = useState(false)
  const otherFixedCanceler = useFixedBottom()
  const toggleFixed = (e: any) => {
    if (!isFixed) {
      otherFixedCanceler(() => setIsFixed(false))
    }
    setIsFixed((current) => !current)
    e.stopPropagation()
  }

  if (!isGameMaster || !canModify) return <></>

  const PanelComponent = () => (
    <Panel header='GM発言' toggleFixed={toggleFixed} isFixed={isFixed}>
      <TalkSystem handleCompleted={handleCompleted} talkAreaId={talkAreaId} />
    </Panel>
  )

  if (!isFixed) {
    return <PanelComponent />
  } else {
    return (
      <Portal target={`#${talkAreaId}-fixed`}>
        <div className='-m-4 max-h-[40vh] overflow-y-scroll md:max-h-full md:overflow-y-hidden'>
          <PanelComponent />
        </div>
      </Portal>
    )
  }
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
