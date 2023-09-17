import {
  Game,
  GameParticipant,
  GameParticipantProfile
} from '@/lib/generated/graphql'
import { useState } from 'react'
import ArticleModal from '@/components/modal/article-modal'
import Profile from './profile'
import Follows from './follows'

type Props = {
  game: Game
  myself: GameParticipant | null
  profile: GameParticipantProfile
  refetchMyself: () => void
}

export default function FollowsCount({
  game,
  myself,
  profile,
  refetchMyself
}: Props) {
  const [isOpenFollowsModal, setIsOpenFollowsModal] = useState(false)
  const toggleFollowsModal = (e: any) => {
    setIsOpenFollowsModal(!isOpenFollowsModal)
  }

  const [isOpenProfileModal, setIsOpenProfileModal] = useState(false)
  const toggleProfileModal = (e: any) => {
    setIsOpenProfileModal(!isOpenProfileModal)
  }
  const [profileParticipantId, setProfileParticipantId] = useState<string>('')
  const openProfileModal = async (participantId: string) => {
    setProfileParticipantId(participantId)
    setIsOpenProfileModal(true)
  }

  if (profile.followsCount <= 0) {
    return (
      <>
        フォロー: <span className='font-bold'>{profile.followsCount}</span>
      </>
    )
  }

  return (
    <>
      <button
        className='primary-hover-text'
        onClick={() => setIsOpenFollowsModal(true)}
      >
        フォロー: <span className='font-bold'>{profile.followsCount}</span>
      </button>
      {isOpenFollowsModal && (
        <ArticleModal
          header={`${profile.name} のフォロー一覧`}
          close={toggleFollowsModal}
          hideFooter
        >
          <Follows
            participantId={profile.participantId}
            openProfileModal={openProfileModal}
          />
        </ArticleModal>
      )}
      {isOpenProfileModal && (
        <ArticleModal
          header={
            game.participants.find((p) => p.id === profileParticipantId)?.name
          }
          close={toggleProfileModal}
          hideFooter
        >
          <Profile
            game={game}
            myself={myself}
            participantId={profileParticipantId}
            refetchMyself={refetchMyself}
            close={toggleProfileModal}
          />
        </ArticleModal>
      )}
    </>
  )
}
