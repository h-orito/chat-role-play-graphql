import {
  GameDirectMessagesDocument,
  GameDirectMessagesQuery,
  GameDirectMessagesQueryVariables,
  DirectMessagesQuery,
  Game,
  GameParticipant,
  GameParticipantGroup,
  DirectMessages,
  PageableQuery,
  DirectMessage
} from '@/lib/generated/graphql'
import { useLazyQuery } from '@apollo/client'
import { cloneElement, useEffect, useRef, useState } from 'react'
import Paging from '../message-area/messages-area/paging'
import DirectMessageComponent from './direct-message'
import DirectSearchCondition from './direct-search-condition'
import { ArrowLeftIcon, PencilIcon } from '@heroicons/react/24/outline'
import Modal from '@/components/modal/modal'
import ParticipantGroupEdit from './participant-group-edit'
import {
  useUserDisplaySettings,
  useUserPagingSettings
} from '../../../user-settings'
import DirectFooterMenu from './direct-footer-menu'
import Portal from '@/components/modal/portal'

type Props = {
  close: (e: any) => void
  game: Game
  myself: GameParticipant | null
  group: GameParticipantGroup
  openProfileModal: (participantId: string) => void
  openFavoritesModal: (messageId: string) => void
  refetchGroups: () => void
}

export default function DirectMessageArea(props: Props) {
  const {
    close,
    game,
    myself,
    group,
    openProfileModal,
    openFavoritesModal,
    refetchGroups
  } = props
  const [pagingSettings] = useUserPagingSettings()
  const defaultQuery: DirectMessagesQuery | null = {
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

  const search = async (q: DirectMessagesQuery = query) => {
    setQuery(q)
    const { data } = await fetchDirectMessages({
      variables: {
        gameId: game.id,
        query: q
      } as GameDirectMessagesQueryVariables
    })
    if (data?.directMessages == null) return
    setDirectMessages(data.directMessages as DirectMessages)
  }

  useEffect(() => {
    if (defaultQuery == null) return
    search(defaultQuery)
  }, [group])

  if (group == null) return <></>

  const setPageableQuery = (q: PageableQuery) => {
    const newQuery = {
      ...query,
      paging: q
    } as DirectMessagesQuery
    search(newQuery)
  }

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

  const [userDisplaySettings] = useUserDisplaySettings()

  return (
    <DirectMessageModal
      {...props}
      search={search}
      close={close}
      canModify={canModify}
      scrollToTop={scrollToTop}
      scrollToBottom={scrollToBottom}
    >
      <div className='flex h-full flex-1 flex-col overflow-y-auto'>
        <div
          className='flex-1 flex-col overflow-y-auto'
          ref={directMessageAreaRef}
        >
          <DirectMessageGroupMembers {...props} canModify={canModify} />
          <div className='base-border flex border-b'>
            <DirectSearchCondition
              game={game}
              myself={myself}
              group={group}
              query={query!}
              search={search}
            />
          </div>
          <Paging
            messages={directMessages}
            query={query!.paging as PageableQuery | undefined}
            setPageableQuery={setPageableQuery}
          />
          <div className='flex-1'>
            {directMessages.list.map((message: DirectMessage) => (
              <DirectMessageComponent
                game={game}
                directMessage={message}
                myself={myself}
                key={message.id}
                openProfileModal={openProfileModal}
                openFavoritesModal={openFavoritesModal}
                imageSizeRatio={userDisplaySettings.iconSizeRatio ?? 1}
              />
            ))}
          </div>
          <Paging
            messages={directMessages}
            query={query!.paging as PageableQuery | undefined}
            setPageableQuery={setPageableQuery}
          />
        </div>
      </div>
    </DirectMessageModal>
  )
}

const DirectMessageModal = (
  props: {
    children: React.ReactNode
    search: (query?: DirectMessagesQuery) => Promise<void>
    close: (e: any) => void
    canModify: boolean
    scrollToTop: () => void
    scrollToBottom: () => void
  } & Props
) => {
  const {
    close,
    game,
    myself,
    group,
    search,
    canModify,
    scrollToTop,
    scrollToBottom
  } = props
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
          <DirectFooterMenu
            game={game}
            myself={myself}
            group={group}
            search={search}
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
  const { game, refetchGroups, group, canModify } = props
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
            game={game}
            group={group}
            close={toggleModifyGroupModal}
            refetchGroups={refetchGroups}
          />
        </Modal>
      )}
    </div>
  )
}
