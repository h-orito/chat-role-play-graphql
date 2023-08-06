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
import { useEffect, useState } from 'react'
import Paging from '../paging'
import DirectMessageComponent from './direct-message'
import DirectSearchCondition from './direct-search-condition'
import { PencilIcon, PencilSquareIcon } from '@heroicons/react/24/outline'
import Modal from '@/components/modal/modal'
import ParticipantGroupEdit from './participant-group-edit'
import TalkDirect from '../../../talk/talk-direct'

type Props = {
  close: (e: any) => void
  game: Game
  myself: GameParticipant
  group: GameParticipantGroup | null
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
  const defaultQuery: DirectMessagesQuery | null =
    group == null
      ? null
      : {
          participantGroupId: group.id,
          paging: {
            pageSize: 10,
            pageNumber: 1,
            isDesc: true
          }
        }
  const [query, setQuery] = useState<DirectMessagesQuery | null>(defaultQuery)
  const [directMessages, setDirectMessages] = useState<DirectMessages>({
    list: [],
    allPageCount: 0,
    hasPrePage: false,
    hasNextPage: false,
    isDesc: true,
    latestUnixTimeMilli: 0
  })

  const [fetchDirectMessages] = useLazyQuery<GameDirectMessagesQuery>(
    GameDirectMessagesDocument
  )

  const search = async (query: DirectMessagesQuery) => {
    const newQuery = {
      ...query
    }
    setQuery(newQuery)
    const { data } = await fetchDirectMessages({
      variables: {
        gameId: game.id,
        query: query
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

  const setPageableQuery = (pageNumber: number) => {
    const newQuery = {
      ...query,
      paging: {
        ...query!.paging,
        pageNumber
      } as PageableQuery
    } as DirectMessagesQuery
    setQuery(newQuery)
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
  const toggleTalkModal = (e: any) => {
    if (e.target === e.currentTarget) {
      setIsOpenTalkModal(!isOpenTalkModal)
    }
  }

  const canModify = ['Opening', 'Recruiting', 'Progress'].includes(game.status)

  return (
    <div className={`flex flex-1 flex-col overflow-y-auto`}>
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
        <div className='flex border-b border-gray-300'>
          <button
            className='flex w-full justify-start py-2 pl-4 hover:bg-slate-200'
            onClick={() => setIsOpenTalkModal(true)}
          >
            <PencilSquareIcon className='mr-1 h-6 w-6' />
            <p className='flex-1 self-center text-left'>発言</p>
          </button>
        </div>
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
        setQuery={setPageableQuery}
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
        setQuery={setPageableQuery}
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
            close={toggleTalkModal}
          />
        </Modal>
      )}
    </div>
  )
}
