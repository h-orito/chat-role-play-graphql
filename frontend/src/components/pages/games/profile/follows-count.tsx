import { GameParticipantProfile } from '@/lib/generated/graphql'
import { useState } from 'react'
import Follows from './follows'
import { useGameValue } from '../game-hook'
import Modal from '@/components/modal/modal'

type Props = {
  profile: GameParticipantProfile
}

export default function FollowsCount({ profile }: Props) {
  const game = useGameValue()
  const [isOpenFollowsModal, setIsOpenFollowsModal] = useState(false)
  const toggleFollowsModal = (e: any) => {
    setIsOpenFollowsModal(!isOpenFollowsModal)
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
        <Modal
          header={`${profile.name} のフォロー一覧`}
          close={toggleFollowsModal}
          hideFooter
        >
          <Follows participantId={profile.participantId} />
        </Modal>
      )}
    </>
  )
}
