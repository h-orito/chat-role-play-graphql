import Image from 'next/image'
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
  LeaveDocument,
  LeaveMutation,
  LeaveMutationVariables,
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
import MessageText from '../article/message-area/message-text/message-text'

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

  const [leave] = useMutation<LeaveMutation>(LeaveDocument, {
    onCompleted(e) {
      location.reload()
    },
    onError(error) {
      console.error(error)
    }
  })

  const confirmToLeave = () => {
    if (confirm('この操作は取り消せません。本当に退出しますか？')) {
      leave({
        variables: {
          input: {
            gameId: game.id
          }
        } as LeaveMutationVariables
      })
    }
  }

  if (profile == null) return <div>Loading...</div>

  const canEdit =
    myself?.id === profile.participantId &&
    ['Closed', 'Opening', 'Recruiting', 'Progress', 'Epilogue'].includes(
      game.status
    )

  const toggleEditModal = (e: any) => {
    if (e.target === e.currentTarget) {
      setIsOpenEditModal(!isOpenEditModal)
    }
  }

  return (
    <div className='p-4'>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        <div>
          {profile.profileImageUrl ? (
            <img
              src={profile.profileImageUrl}
              width={400}
              alt='プロフィール画像'
            />
          ) : (
            <Image
              src={'/chat-role-play/images/profile.webp'}
              width={400}
              height={600}
              alt='プロフィール画像'
            />
          )}
        </div>
        <div>
          <div className='flex'>
            <p className='text-lg font-bold'>
              <span className='text-sm font-normal text-gray-500'>
                ENo{profile.entryNumber}.&nbsp;
              </span>
              {profile.name}
              {profile.isGone ? (
                <span className='text-sm font-normal text-gray-500'>
                  （退出済み）
                </span>
              ) : (
                ''
              )}
            </p>
            <div className='ml-auto'>
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
              {canEdit && (
                <PrimaryButton click={() => setIsOpenEditModal(true)}>
                  プロフィール編集
                </PrimaryButton>
              )}
            </div>
          </div>
          {profile.introduction && (
            <p className='my-2 whitespace-pre-wrap break-words rounded-md bg-gray-100 p-4 text-xs text-gray-700'>
              <MessageText rawText={profile.introduction} />
            </p>
          )}
          <div>
            <FollowsCount
              game={game}
              myself={myself}
              profile={profile}
              refetchMyself={refetchMyself}
            />
            &nbsp;&nbsp;
            <FollowersCount
              game={game}
              myself={myself}
              profile={profile}
              refetchMyself={refetchMyself}
            />
          </div>
          <ParticipantIcons
            game={game}
            myself={myself}
            icons={icons}
            canEdit={canEdit}
            refetchIcons={refetchIcons}
          />
        </div>
      </div>
      {canEdit && (
        <div className='mt-4 flex justify-end'>
          <DangerButton click={() => confirmToLeave()}>退出する</DangerButton>
        </div>
      )}
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
