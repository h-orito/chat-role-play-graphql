import {
  Game,
  GameParticipant,
  GameParticipantProfile
} from '@/lib/generated/graphql'
import { useState } from 'react'
import ArticleModal from '@/components/modal/article-modal'
import Profile from './profile'
import Followers from './followers'

type Props = {
  game: Game
  myself: GameParticipant | null
  profile: GameParticipantProfile
  refetchMyself: () => void
}

export default function FollowersCount({
  game,
  myself,
  profile,
  refetchMyself
}: Props) {
  const [isOpenFollowersModal, setIsOpenFollowersModal] = useState(false)
  const toggleFollowersModal = (e: any) => {
    setIsOpenFollowersModal(!isOpenFollowersModal)
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

  if (profile.followersCount <= 0) {
    return (
      <>
        フォロワー: <span className='font-bold'>{profile.followersCount}</span>
      </>
    )
  }
  return (
    <>
      <button
        className='hover:text-blue-500'
        onClick={() => setIsOpenFollowersModal(true)}
      >
        フォロワー: <span className='font-bold'>{profile.followersCount}</span>
      </button>
      {isOpenFollowersModal && (
        <ArticleModal
          header={`${profile.name} のフォロワー一覧`}
          close={toggleFollowersModal}
          hideFooter
        >
          <Followers
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
