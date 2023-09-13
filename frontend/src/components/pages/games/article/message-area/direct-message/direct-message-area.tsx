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
import { useEffect, useRef, useState } from 'react'
import Paging from '../paging'
import DirectMessageComponent from './direct-message'
import DirectSearchCondition from './direct-search-condition'
import { EnvelopeIcon, PencilIcon } from '@heroicons/react/24/outline'
import Modal from '@/components/modal/modal'
import ParticipantGroupEdit from './participant-group-edit'
import TalkDirect, { TalkDirectRefHandle } from '../../../talk/talk-direct'
import { useUserPagingSettings } from '../../../user-settings'

type Props = {
  close: (e: any) => void
  game: Game
  myself: GameParticipant
  group: GameParticipantGroup
  openProfileModal: (participantId: string) => void
  openFavoritesModal: (messageId: string) => void
  refetchGroups: () => void
}

export default function DirectMessageArea({
  close,
  game,
  myself,
  group,
  openProfileModal,
  openFavoritesModal,
  refetchGroups
}: Props) {
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

  const [isOpenModifyGroupModal, setIsOpenModifyGroupModal] = useState(false)
  const toggleModifyGroupModal = (e: any) => {
    if (e.target === e.currentTarget) {
      setIsOpenModifyGroupModal(!isOpenModifyGroupModal)
    }
  }
  const openModifyGroupModal = (group: GameParticipantGroup) => {
    setIsOpenModifyGroupModal(true)
  }

  const [isOpenTalkModal, setIsOpenTalkModal] = useState(false)
  const talkRef = useRef({} as TalkDirectRefHandle)
  const toggleTalkModal = (e: any) => {
    const shouldWarning = talkRef.current && talkRef.current.shouldWarnClose()
    if (
      shouldWarning &&
      !window.confirm('発言内容が失われますが、閉じてよろしいですか？')
    )
      return
    setIsOpenTalkModal(!isOpenTalkModal)
  }

  const canModify = ['Opening', 'Recruiting', 'Progress', 'Epilogue'].includes(
    game.status
  )

  return (
    <div className='flex flex-1 flex-col'>
      <div className='flex border-b border-gray-300 px-4 py-2'>
        <p className='self-center'>
          メンバー:{' '}
          {group.participants.map((p: GameParticipant) => p.name).join('、')}
        </p>
        {canModify && (
          <button
            className='ml-auto pl-4 hover:bg-slate-200'
            onClick={() => openModifyGroupModal(group)}
          >
            <PencilIcon className='mr-1 h-4 w-4' />
          </button>
        )}
      </div>
      {canModify && (
        <button
          className='fixed bottom-20 right-4 z-10 rounded-full bg-blue-400 p-3 hover:bg-slate-200'
          onClick={() => setIsOpenTalkModal(true)}
        >
          <EnvelopeIcon className='h-8 w-8' />
        </button>
      )}
      <div className='flex border-b border-gray-300'>
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
      <div className='flex-1 overflow-y-auto'>
        {directMessages.list.map((message: DirectMessage) => (
          <DirectMessageComponent
            game={game}
            directMessage={message}
            myself={myself}
            key={message.id}
            openProfileModal={openProfileModal}
            openFavoritesModal={openFavoritesModal}
          />
        ))}
      </div>
      <Paging
        messages={directMessages}
        query={query!.paging as PageableQuery | undefined}
        setPageableQuery={setPageableQuery}
      />
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
      {isOpenTalkModal && (
        <Modal close={toggleTalkModal} hideFooter>
          <TalkDirect
            game={game}
            myself={myself!}
            gameParticipantGroup={group!}
            closeWithoutWarning={() => setIsOpenTalkModal(false)}
            search={search}
            ref={talkRef}
          />
        </Modal>
      )}
    </div>
  )
}
