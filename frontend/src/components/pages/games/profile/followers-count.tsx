import { GameParticipantProfile } from '@/lib/generated/graphql'
import Followers from './followers'
import Modal from '@/components/modal/modal'
import { useModal } from '@/components/hooks/use-modal'

type Props = {
  profile: GameParticipantProfile
}

export default function FollowersCount({ profile }: Props) {
  const followersModal = useModal()

  if (profile.followersCount <= 0) {
    return (
      <>
        フォロワー: <span className='font-bold'>{profile.followersCount}</span>
      </>
    )
  }
  return (
    <>
      <button className='primary-hover-text' onClick={followersModal.open}>
        フォロワー: <span className='font-bold'>{profile.followersCount}</span>
      </button>
      {followersModal.isOpen && (
        <Modal
          header={`${profile.name} のフォロワー一覧`}
          close={followersModal.close}
          hideFooter
        >
          <Followers participantId={profile.participantId} />
        </Modal>
      )}
    </>
  )
}
