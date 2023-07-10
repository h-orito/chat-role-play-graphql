import PrimaryButton from '@/components/button/primary-button'
import Modal from '@/components/modal/modal'
import {
  FollowDocument,
  FollowMutation,
  FollowMutationVariables,
  Game,
  GameParticipant,
  GameParticipantIcon,
  GameParticipantProfile,
  GameParticipantProfileDocument,
  GameParticipantProfileQuery,
  IconsDocument,
  IconsQuery,
  UnfollowDocument,
  UnfollowMutation,
  UnfollowMutationVariables
} from '@/lib/generated/graphql'
import { useCallback, useEffect, useState } from 'react'
import ProfileEdit from './profile-edit'
import { useLazyQuery, useMutation } from '@apollo/client'
import DangerButton from '@/components/button/danger-button'
import FollowsCount from './follows-count'
import FollowersCount from './followers-count'
import ParticipantIcons from './participant-icons'

type Props = {
  close: (e: any) => void
  game: Game
  participantId: string
  myself: GameParticipant | null
  refetchMyself: () => void
}

export default function Profile({
  close,
  game,
  participantId,
  myself,
  refetchMyself
}: Props) {
  const [profile, setProfile] = useState<GameParticipantProfile | null>(null)
  const [icons, setIcons] = useState<Array<GameParticipantIcon>>([])
  const [isOpenEditModal, setIsOpenEditModal] = useState(false)

  const [fetchProfile] = useLazyQuery<GameParticipantProfileQuery>(
    GameParticipantProfileDocument
  )
  const [fetchIcons] = useLazyQuery<IconsQuery>(IconsDocument)

  const refetchProfile = async () => {
    const { data } = await fetchProfile({
      variables: { participantId }
    })
    if (data?.gameParticipantProfile == null) return
    setProfile(data.gameParticipantProfile)
  }

  const refetchIcons = async (): Promise<Array<GameParticipantIcon>> => {
    const { data } = await fetchIcons({
      variables: { participantId }
    })
    if (data?.gameParticipantIcons == null) return []
    setIcons(data.gameParticipantIcons as Array<GameParticipantIcon>)
    return data.gameParticipantIcons as Array<GameParticipantIcon>
  }

  useEffect(() => {
    refetchProfile()
    refetchIcons()
  }, [participantId])

  if (profile == null) return <div>Loading...</div>

  const canEdit = myself?.id === profile.participantId

  const toggleEditModal = (e: any) => {
    if (e.target === e.currentTarget) {
      setIsOpenEditModal(!isOpenEditModal)
    }
  }

  return (
    <div className='p-4'>
      <p>なまえ: {profile.name}</p>
      <p>紹介文: {profile.introduction}</p>
      {profile.profileImageUrl && (
        <img src={profile.profileImageUrl} width={400} alt='プロフィール画像' />
      )}
      <div>
        <FollowsCount
          game={game}
          myself={myself}
          profile={profile}
          refetchMyself={refetchMyself}
        />
        &nbsp;
        <FollowersCount
          game={game}
          myself={myself}
          profile={profile}
          refetchMyself={refetchMyself}
        />
      </div>
      {canEdit && (
        <PrimaryButton click={() => setIsOpenEditModal(true)}>
          編集
        </PrimaryButton>
      )}
      <FollowButton
        game={game}
        participantId={participantId}
        myself={myself}
        profile={profile}
        refetchMyself={refetchMyself}
        refetchProfile={refetchProfile}
      />
      <UnfollowButton
        game={game}
        participantId={participantId}
        myself={myself}
        profile={profile}
        refetchMyself={refetchMyself}
        refetchProfile={refetchProfile}
      />
      <ParticipantIcons
        game={game}
        myself={myself}
        icons={icons}
        canEdit={canEdit}
        refetchIcons={refetchIcons}
      />
      {isOpenEditModal && (
        <Modal header='プロフィール編集' close={toggleEditModal} hideFooter>
          <ProfileEdit
            game={game}
            myself={myself}
            refetchMyself={refetchMyself}
            profile={profile}
            icons={icons}
            refetchProfile={refetchProfile}
            close={toggleEditModal}
          />
        </Modal>
      )}
    </div>
  )
}

type FollowButtonProps = {
  game: Game
  participantId: string
  myself: GameParticipant | null
  profile: GameParticipantProfile
  refetchMyself: () => void
  refetchProfile: () => void
}

const FollowButton = ({
  game,
  participantId,
  myself,
  profile,
  refetchMyself,
  refetchProfile
}: FollowButtonProps) => {
  const [follow] = useMutation<FollowMutation>(FollowDocument, {
    onCompleted(e) {
      refetchMyself()
      refetchProfile()
    },
    onError(error) {
      console.error(error)
    }
  })

  const handleFollow = useCallback(() => {
    follow({
      variables: {
        input: {
          gameId: game.id,
          targetGameParticipantId: participantId
        }
      } as FollowMutationVariables
    })
  }, [follow])

  const canFollow =
    myself != null &&
    myself.id !== profile.participantId &&
    !myself.followParticipantIds.some((id) => id === profile.participantId)

  if (!canFollow) return <></>

  return <PrimaryButton click={() => handleFollow()}>フォロー</PrimaryButton>
}

type UnfollowButtonProps = {
  game: Game
  participantId: string
  myself: GameParticipant | null
  profile: GameParticipantProfile
  refetchMyself: () => void
  refetchProfile: () => void
}

const UnfollowButton = ({
  game,
  participantId,
  myself,
  profile,
  refetchMyself,
  refetchProfile
}: UnfollowButtonProps) => {
  const [unfollow] = useMutation<UnfollowMutation>(UnfollowDocument, {
    onCompleted(e) {
      refetchMyself()
      refetchProfile()
    },
    onError(error) {
      console.error(error)
    }
  })

  const handleUnfollow = useCallback(() => {
    unfollow({
      variables: {
        input: {
          gameId: game.id,
          targetGameParticipantId: participantId
        }
      } as UnfollowMutationVariables
    })
  }, [unfollow])

  const canUnfollow =
    myself != null &&
    myself.id !== profile.participantId &&
    myself.followParticipantIds.some((id) => id === profile.participantId)

  if (!canUnfollow) return <></>

  return (
    <DangerButton click={() => handleUnfollow()}>フォロー解除</DangerButton>
  )
}
