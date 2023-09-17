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

  const isMyself = myself?.id === profile.participantId
  const canEdit =
    isMyself &&
    ['Closed', 'Opening', 'Recruiting', 'Progress', 'Epilogue'].includes(
      game.status
    )

  return (
    <div className='p-4'>
      <div className='md:flex'>
        {profile.profileImageUrl && (
          <div className='mb-4 flex justify-center md:mr-4 md:block'>
            <img
              src={profile.profileImageUrl}
              width={400}
              alt='プロフィール画像'
            />
          </div>
        )}
        <div className='md:flex-1'>
          <div className='flex'>
            <ParticipantName profile={profile} />
            <FFButtons
              game={game}
              participantId={participantId}
              myself={myself}
              profile={profile}
              refetchMyself={refetchMyself}
              refetchProfile={refetchProfile}
              close={close}
              canEdit={canEdit}
              icons={icons}
            />
          </div>
          {profile.introduction && (
            <p className='my-2 whitespace-pre-wrap break-words rounded-md bg-gray-100 p-4 text-xs text-gray-700'>
              <MessageText rawText={profile.introduction} />
            </p>
          )}
          {isMyself && (
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
          )}
          <ParticipantIcons
            game={game}
            myself={myself}
            icons={icons}
            canEdit={canEdit}
            refetchIcons={refetchIcons}
          />
        </div>
      </div>
      {canEdit && <LeaveButton game={game} />}
    </div>
  )
}

const LeaveButton = ({ game }: { game: Game }) => {
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

  return (
    <div className='mt-4 flex justify-end'>
      <DangerButton click={() => confirmToLeave()}>退出する</DangerButton>
    </div>
  )
}

const ParticipantName = ({ profile }: { profile: GameParticipantProfile }) => {
  return (
    <p className='text-lg font-bold'>
      <span className='secondary-text text-sm font-normal'>
        ENo{profile.entryNumber}.&nbsp;
      </span>
      {profile.name}
      {profile.isGone ? (
        <span className='secondary-text text-sm font-normal'>（退出済み）</span>
      ) : (
        ''
      )}
    </p>
  )
}

const FFButtons = (
  props: Props & {
    refetchProfile: () => void
    profile: GameParticipantProfile
    canEdit: boolean
    icons: Array<GameParticipantIcon>
  }
) => {
  const {
    game,
    participantId,
    myself,
    profile,
    refetchMyself,
    refetchProfile,
    canEdit,
    icons
  } = props
  const [isOpenEditModal, setIsOpenEditModal] = useState(false)
  const toggleEditModal = (e: any) => {
    if (e.target === e.currentTarget) {
      setIsOpenEditModal(!isOpenEditModal)
    }
  }

  return (
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
        <>
          <PrimaryButton click={() => setIsOpenEditModal(true)}>
            プロフィール編集
          </PrimaryButton>
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
        </>
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
