import { GameParticipantProfile } from '@/lib/generated/graphql'
import Follows from './follows'
import { useGameValue } from '../game-hook'
import Modal from '@/components/modal/modal'
import { useModal } from '@/components/hooks/use-modal'

type Props = {
  profile: GameParticipantProfile
}

export default function FollowsCount({ profile }: Props) {
  const game = useGameValue()
  const followsModal = useModal()

  if (profile.followsCount <= 0) {
    return (
      <>
        フォロー: <span className='font-bold'>{profile.followsCount}</span>
      </>
    )
  }

  return (
    <>
      <button className='primary-hover-text' onClick={followsModal.open}>
        フォロー: <span className='font-bold'>{profile.followsCount}</span>
      </button>
      {followsModal.isOpen && (
        <Modal
          header={`${profile.name} のフォロー一覧`}
          close={followsModal.close}
          hideFooter
        >
          <Follows participantId={profile.participantId} />
        </Modal>
      )}
    </>
  )
}
