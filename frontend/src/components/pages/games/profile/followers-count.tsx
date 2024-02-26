import { GameParticipantProfile } from '@/lib/generated/graphql'
import { useState } from 'react'
import Followers from './followers'
import Modal from '@/components/modal/modal'

type Props = {
  profile: GameParticipantProfile
}

export default function FollowersCount({ profile }: Props) {
  const [isOpenFollowersModal, setIsOpenFollowersModal] = useState(false)
  const toggleFollowersModal = (e: any) => {
    setIsOpenFollowersModal(!isOpenFollowersModal)
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
        className='primary-hover-text'
        onClick={() => setIsOpenFollowersModal(true)}
      >
        フォロワー: <span className='font-bold'>{profile.followersCount}</span>
      </button>
      {isOpenFollowersModal && (
        <Modal
          header={`${profile.name} のフォロワー一覧`}
          close={toggleFollowersModal}
          hideFooter
        >
          <Followers participantId={profile.participantId} />
        </Modal>
      )}
    </>
  )
}
