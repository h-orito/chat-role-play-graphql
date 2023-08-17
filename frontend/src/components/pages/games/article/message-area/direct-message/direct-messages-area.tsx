import {
  Game,
  GameParticipant,
  GameParticipantGroup,
  GameParticipantGroupsQuery,
  ParticipantGroupsDocument,
  ParticipantGroupsQuery
} from '@/lib/generated/graphql'
import { useEffect, useState } from 'react'
import { useLazyQuery } from '@apollo/client'
import PrimaryButton from '@/components/button/primary-button'
import CreateParticipantGroup from './create-participant-group'
import ArticleModal from '@/components/modal/article-modal'
import DirectMessageArea from './direct-message-area'
import Modal from '@/components/modal/modal'
import DirectFavoriteParticipants from './direct-favorite-participants'

type Props = {
  game: Game
  className?: string
  myself: GameParticipant
  openProfileModal: (participantId: string) => void
}

export default function DirectMessagesArea({
  game,
  className,
  myself,
  openProfileModal
}: Props) {
  const [fetchParticipantGroups] = useLazyQuery<ParticipantGroupsQuery>(
    ParticipantGroupsDocument
  )
  const [groups, setGroups] = useState<GameParticipantGroup[]>([])

  const [isOpenCreateModal, setIsOpenCreateModal] = useState(false)
  const toggleCreateModal = (e: any) => {
    setIsOpenCreateModal(!isOpenCreateModal)
  }

  const [directMessageGroup, setDirectMessageGroup] =
    useState<GameParticipantGroup | null>(null)
  const [isOpenDirectMessageModal, setIsDirectMessageModal] = useState(false)
  const toggleDirectMessageModal = (group: GameParticipantGroup) => {
    setIsDirectMessageModal(!isOpenDirectMessageModal)
  }
  const openDirectMessageModal = (group: GameParticipantGroup) => {
    setDirectMessageGroup(group)
    setIsDirectMessageModal(!isOpenDirectMessageModal)
  }

  const [isOpenFavoritesModal, setIsOpenFavoritesModal] = useState(false)
  const toggleFavoritesModal = (e: any) => {
    if (e.target === e.currentTarget) {
      setIsOpenFavoritesModal(!isOpenFavoritesModal)
    }
  }
  const [favoriteMessageId, setFavoriteMessageId] = useState<string>('')
  const openFavoritesModal = async (messageId: string) => {
    setFavoriteMessageId(messageId)
    setIsOpenFavoritesModal(true)
  }

  const refetchGroups = async () => {
    const { data } = await fetchParticipantGroups({
      variables: {
        gameId: game.id,
        participantId: myself?.id
      } as GameParticipantGroupsQuery
    })
    if (data?.gameParticipantGroups == null) return
    const newGroups = (
      data.gameParticipantGroups as GameParticipantGroup[]
    ).sort((g1, g2) => {
      // 最終発言が新しい順
      return g2.latestUnixTimeMilli - g1.latestUnixTimeMilli
    })
    setGroups(newGroups)
    if (directMessageGroup != null) {
      const newGroup = data.gameParticipantGroups.find(
        (g) => g.id === directMessageGroup.id
      )
      if (newGroup != null) {
        setDirectMessageGroup(newGroup as GameParticipantGroup)
      }
    }
  }

  useEffect(() => {
    refetchGroups()
  }, [])

  const canCreate = ['Opening', 'Recruiting', 'Progress', 'Epilogue'].includes(
    game.status
  )

  return (
    <div
      id='direct-message-area'
      className={`${className} relative h-full w-full`}
    >
      {canCreate && (
        <div className='flex p-4'>
          <PrimaryButton click={() => setIsOpenCreateModal(true)}>
            グループ作成
          </PrimaryButton>
        </div>
      )}
      {groups.map((group: GameParticipantGroup) => (
        <div
          key={group.id}
          className='border-t border-gray-300 p-4 last:border-b'
        >
          <button onClick={() => openDirectMessageModal(group)}>
            <p className='hover:text-blue-500'>{group.name}</p>
          </button>
        </div>
      ))}
      {isOpenCreateModal && (
        <ArticleModal
          target='#direct-message-area'
          header='新規ダイレクトメッセージグループ'
          close={toggleCreateModal}
          hideFooter
        >
          <CreateParticipantGroup
            game={game}
            myself={myself}
            groups={groups}
            refetchGroups={refetchGroups}
            close={toggleCreateModal}
          />
        </ArticleModal>
      )}
      {isOpenDirectMessageModal && (
        <ArticleModal
          target='#direct-message-area'
          header={`${directMessageGroup ? directMessageGroup.name : ''}`}
          zindex={40}
          close={toggleDirectMessageModal}
          hideFooter
        >
          <DirectMessageArea
            game={game}
            myself={myself}
            group={directMessageGroup!}
            close={toggleDirectMessageModal}
            openProfileModal={openProfileModal}
            openFavoritesModal={openFavoritesModal}
            refetchGroups={refetchGroups}
          />
        </ArticleModal>
      )}
      {isOpenFavoritesModal && (
        <Modal header='ふぁぼした人' close={toggleFavoritesModal} hideFooter>
          <DirectFavoriteParticipants
            game={game}
            myself={myself}
            messageId={favoriteMessageId}
            openProfileModal={openProfileModal}
            close={toggleFavoritesModal}
          />
        </Modal>
      )}
    </div>
  )
}
