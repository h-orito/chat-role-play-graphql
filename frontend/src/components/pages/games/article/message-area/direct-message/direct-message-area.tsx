import {
  GameDirectMessagesDocument,
  GameDirectMessagesQuery,
  GameDirectMessagesQueryVariables,
  DirectMessagesQuery,
  GameParticipant,
  GameParticipantGroup,
  DirectMessages,
  PageableQuery,
  DirectMessage
} from '@/lib/generated/graphql'
import { useLazyQuery } from '@apollo/client'
import {
  cloneElement,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react'
import Paging from '../message-area/messages-area/paging'
import DirectMessageComponent from './direct-message'
import { ArrowLeftIcon, PencilIcon } from '@heroicons/react/24/outline'
import Modal from '@/components/modal/modal'
import ParticipantGroupEdit from './participant-group-edit'
import { useUserPagingSettings } from '../../../user-settings'
import DirectFooterMenu from './direct-footer-menu'
import Portal from '@/components/modal/portal'
import {
  useFixedBottom,
  useGameValue
} from '@/components/pages/games/game-hook'
import Panel from '@/components/panel/panel'
import TalkDirect from '../../../talk/talk-direct'
import { base64ToId } from '@/components/graphql/convert'

type Props = {
  close: (e: any) => void
  group: GameParticipantGroup
  refetchGroups: () => void
}

export default function DirectMessageArea(props: Props) {
  const { close, group } = props
  const game = useGameValue()
  const [pagingSettings] = useUserPagingSettings()
  const defaultQuery: DirectMessagesQuery = {
    participantGroupId: group.id,
    paging: {
      pageSize: pagingSettings.pageSize,
      pageNumber: 1,
      isDesc: pagingSettings.isDesc,
      isLatest: !pagingSettings.isDesc
    }
  }
  const [query, setQuery] = useState<DirectMessagesQuery>(defaultQuery)
  const [directMessages, setDirectMessages] = useState<DirectMessages>({
    list: [],
    allPageCount: 0,
    hasPrePage: false,
    hasNextPage: false,
    isDesc: pagingSettings.isDesc,
    isLatest: !pagingSettings.isDesc,
    latestUnixTimeMilli: 0
  })

  const [fetchDirectMessages] = useLazyQuery<GameDirectMessagesQuery>(
    GameDirectMessagesDocument
  )

  const search = useCallback(
    async (q: DirectMessagesQuery = query) => {
      setQuery(q)
      const { data } = await fetchDirectMessages({
        variables: {
          gameId: game.id,
          query: q
        } as GameDirectMessagesQueryVariables
      })
      if (data?.directMessages == null) return
      setDirectMessages(data.directMessages as DirectMessages)
    },
    [game.id, query]
  )

  useEffect(() => {
    search(defaultQuery)
  }, [group])

  if (group == null) return <></>

  const canModify = ['Opening', 'Recruiting', 'Progress', 'Epilogue'].includes(
    game.status
  )

  const directMessageAreaRef = useRef<HTMLDivElement>(null)
  const scrollToTop = () => {
    directMessageAreaRef?.current?.scroll({ top: 0, behavior: 'smooth' })
  }
  const scrollToBottom = () => {
    directMessageAreaRef?.current?.scroll({
      top: directMessageAreaRef?.current?.scrollHeight,
      behavior: 'smooth'
    })
  }

  const talkAreaId = `talk-direct-${base64ToId(group.id)}`

  return (
    <DirectMessageModal
      {...props}
      search={search}
      query={query}
      close={close}
      canModify={canModify}
      scrollToTop={scrollToTop}
      scrollToBottom={scrollToBottom}
      talkAreaId={talkAreaId}
    >
      <>
        <div className='flex h-full flex-1 flex-col overflow-y-auto'>
          <div
            className='flex-1 flex-col overflow-y-auto'
            ref={directMessageAreaRef}
          >
            <DirectMessageGroupMembers {...props} canModify={canModify} />
            <DirectMessagesArea
              directMessages={directMessages}
              query={query}
              search={search}
              talkAreaId={talkAreaId}
            />
            <DirectTalkArea
              search={search}
              group={group}
              talkAreaId={talkAreaId}
            />
          </div>
        </div>
      </>
    </DirectMessageModal>
  )
}

const DirectMessageModal = (
  props: {
    children: React.ReactNode
    search: (query?: DirectMessagesQuery) => Promise<void>
    query: DirectMessagesQuery
    close: (e: any) => void
    canModify: boolean
    scrollToTop: () => void
    scrollToBottom: () => void
    talkAreaId: string
  } & Props
) => {
  const { close, group, search, canModify, scrollToTop, scrollToBottom } = props
  return (
    <Portal target='#direct-message-area'>
      <div className='base-background absolute inset-x-0 inset-y-0 z-50 h-full w-full text-sm'>
        <div className='flex h-full flex-col overflow-y-auto'>
          <div className='base-border flex border-b p-2'>
            <button className='px-2' onClick={close}>
              <ArrowLeftIcon className='mr-1 h-6 w-6' />
            </button>
            <p className='justify-center text-xl'>{group.name}</p>
          </div>
          {cloneElement(props.children as any, {
            close: close
          })}
          <div id={`${props.talkAreaId}-fixed`}></div>
          <DirectFooterMenu
            group={group}
            search={search}
            query={props.query}
            canTalk={canModify}
            scrollToTop={scrollToTop}
            scrollToBottom={scrollToBottom}
          />
        </div>
      </div>
    </Portal>
  )
}

const DirectMessageGroupMembers = (
  props: {
    canModify: boolean
  } & Props
) => {
  const { refetchGroups, group, canModify } = props
  const [isOpenModifyGroupModal, setIsOpenModifyGroupModal] = useState(false)
  const toggleModifyGroupModal = (e: any) => {
    if (e.target === e.currentTarget) {
      setIsOpenModifyGroupModal(!isOpenModifyGroupModal)
    }
  }
  const openModifyGroupModal = (group: GameParticipantGroup) => {
    setIsOpenModifyGroupModal(true)
  }

  return (
    <div className='base-border flex border-b px-4 py-2'>
      <p className='self-center'>
        メンバー:{' '}
        {group.participants.map((p: GameParticipant) => p.name).join('、')}
      </p>
      {canModify && (
        <button
          className='primary-hover-background ml-auto pl-4'
          onClick={() => openModifyGroupModal(group)}
        >
          <PencilIcon className='mr-1 h-4 w-4' />
        </button>
      )}
      {isOpenModifyGroupModal && (
        <Modal close={toggleModifyGroupModal} hideFooter>
          <ParticipantGroupEdit
            group={group}
            close={toggleModifyGroupModal}
            refetchGroups={refetchGroups}
          />
        </Modal>
      )}
    </div>
  )
}

type DirectMessagesAreaProps = {
  directMessages: DirectMessages
  query: DirectMessagesQuery
  search: (query?: DirectMessagesQuery) => Promise<void>
  talkAreaId: string
}
const DirectMessagesArea = (props: DirectMessagesAreaProps) => {
  const { directMessages, query, search } = props
  const setPageableQuery = (q: PageableQuery) => {
    const newQuery = {
      ...query,
      paging: q
    } as DirectMessagesQuery
    search(newQuery)
  }

  const scrollToTop = () => {
    document.getElementById(`${props.talkAreaId}-top`)?.scrollIntoView()
  }

  return (
    <>
      <Paging
        messages={directMessages}
        query={query!.paging as PageableQuery | undefined}
        setPageableQuery={setPageableQuery}
        scrollToTop={scrollToTop}
      />
      <div className='flex-1'>
        <div id={`${props.talkAreaId}-top`}></div>
        <div id={`${props.talkAreaId}-top-preview`}></div>
        {directMessages.list.map((message: DirectMessage) => (
          <DirectMessageComponent directMessage={message} key={message.id} />
        ))}
        <div id={`${props.talkAreaId}-bottom-preview`}></div>
        <div id={`${props.talkAreaId}-bottom`}></div>
      </div>
      <Paging
        messages={directMessages}
        query={query!.paging as PageableQuery | undefined}
        setPageableQuery={setPageableQuery}
        scrollToTop={scrollToTop}
      />
    </>
  )
}

type DirectTalkAreaProps = {
  group: GameParticipantGroup
  search: (query?: DirectMessagesQuery) => Promise<void>
  talkAreaId: string
}
const DirectTalkArea = memo((props: DirectTalkAreaProps) => {
  return (
    <div id={props.talkAreaId} className='base-border w-full border-t text-sm'>
      <DirectTalkPanel {...props} />
    </div>
  )
})

const DirectTalkPanel = (props: DirectTalkAreaProps) => {
  const { group, search } = props

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

  const PanelComponent = () => (
    <Panel
      header='ダイレクトメッセージ'
      toggleFixed={toggleFixed}
      isFixed={isFixed}
    >
      <TalkDirect
        gameParticipantGroup={group}
        handleCompleted={handleCompleted}
        talkAreaId={props.talkAreaId}
      />
    </Panel>
  )

  if (!isFixed) {
    return <PanelComponent />
  } else {
    return (
      <Portal target={`#${props.talkAreaId}-fixed`}>
        <div className='-m-4 max-h-[40vh] overflow-y-scroll md:max-h-full md:overflow-y-hidden'>
          <PanelComponent />
        </div>
      </Portal>
    )
  }
}
