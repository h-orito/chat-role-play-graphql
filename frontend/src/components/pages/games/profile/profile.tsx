import Image from 'next/image'
import PrimaryButton from '@/components/button/primary-button'
import Modal from '@/components/modal/modal'
import {
  DeleteParticipantIconDocument,
  DeleteParticipantIconMutation,
  DeleteParticipantIconMutationVariables,
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
import { TrashIcon } from '@heroicons/react/24/outline'
import { useCallback, useEffect, useState } from 'react'
import ProfileEdit from './profile-edit'
import { useLazyQuery, useMutation } from '@apollo/client'
import DangerButton from '@/components/button/danger-button'
import ParticipantIconAdd from './participant-icon-add'

type Props = {
  close: (e: any) => void
  game: Game
  myself: GameParticipant | null
  refetchMyself: () => void
  participantId: string
}

export default function Profile({
  close,
  game,
  myself,
  refetchMyself,
  participantId
}: Props) {
  const [profile, setProfile] = useState<GameParticipantProfile | null>(null)
  const [icons, setIcons] = useState<Array<GameParticipantIcon>>([])
  const [isOpenEditModal, setIsOpenEditModal] = useState(false)
  const [isOpenIconAddModal, setIsOpenIconAddModal] = useState(false)
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

  const refetchIcons = async () => {
    const { data } = await fetchIcons({
      variables: { participantId }
    })
    if (data?.gameParticipantIcons == null) return
    setIcons(data.gameParticipantIcons)
  }

  useEffect(() => {
    refetchProfile()
    refetchIcons()
  }, [participantId])

  const [follow] = useMutation<FollowMutation>(FollowDocument, {
    onCompleted(e) {
      refetchMyself()
      refetchProfile()
    },
    onError(error) {
      console.error(error)
    }
  })
  const [unfollow] = useMutation<UnfollowMutation>(UnfollowDocument, {
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

  if (profile == null) return <div>Loading...</div>

  const canEdit = myself?.id === profile.participantId
  const canFollow =
    myself != null &&
    myself.id !== profile.participantId &&
    !myself.followParticipantIds.some((id) => id === profile.participantId)
  const canUnfollow =
    myself != null &&
    myself.id !== profile.participantId &&
    myself.followParticipantIds.some((id) => id === profile.participantId)

  const toggleEditModal = (e: any) => {
    if (e.target === e.currentTarget) {
      setIsOpenEditModal(!isOpenEditModal)
    }
  }
  const toggleIconAddModal = (e: any) => {
    if (e.target === e.currentTarget) {
      setIsOpenIconAddModal(!isOpenIconAddModal)
    }
  }

  return (
    <div className='p-4'>
      <p>なまえ: {profile.name}</p>
      <p>紹介文: {profile.introduction}</p>
      {profile.profileImageUrl && (
        <img
          className='w-32'
          src={profile.profileImageUrl}
          alt='プロフィール画像'
        />
      )}
      <p>フォロー: {profile.followsCount}</p>
      <p>フォロワー: {profile.followersCount}</p>
      {canEdit && (
        <PrimaryButton click={() => setIsOpenEditModal(true)}>
          編集
        </PrimaryButton>
      )}
      {canFollow && (
        <PrimaryButton click={() => handleFollow()}>フォロー</PrimaryButton>
      )}
      {canUnfollow && (
        <DangerButton click={() => handleUnfollow()}>フォロー解除</DangerButton>
      )}
      <ParticipantIcons
        game={game}
        icons={icons}
        canEdit={canEdit}
        refetchIcons={refetchIcons}
      />
      {canEdit && (
        <PrimaryButton click={() => setIsOpenIconAddModal(true)}>
          アイコン登録
        </PrimaryButton>
      )}
      {isOpenEditModal && (
        <Modal header='プロフィール編集' close={toggleEditModal} hideFooter>
          <ProfileEdit
            game={game}
            myself={myself}
            refetchMyself={refetchMyself}
            profile={profile}
            refetchProfile={refetchProfile}
            close={toggleEditModal}
          />
        </Modal>
      )}
      {isOpenIconAddModal && (
        <Modal header='アイコン追加' close={toggleIconAddModal} hideFooter>
          <ParticipantIconAdd
            game={game}
            myself={myself}
            icons={icons}
            refetchIcons={refetchIcons}
            close={toggleIconAddModal}
          />
        </Modal>
      )}
    </div>
  )
}

type IconsProps = {
  game: Game
  icons: Array<GameParticipantIcon>
  canEdit: boolean
  refetchIcons: () => void
}

const ParticipantIcons = ({
  game,
  icons,
  canEdit,
  refetchIcons
}: IconsProps) => {
  const [deleteIcon] = useMutation<DeleteParticipantIconMutation>(
    DeleteParticipantIconDocument,
    {
      onCompleted(e) {
        refetchIcons()
      },
      onError(error) {
        console.error(error)
      }
    }
  )

  const handleDelete = useCallback(
    (iconId: string) => {
      if (window.confirm('アイコンを削除しますか？') === false) return
      deleteIcon({
        variables: {
          input: {
            gameId: game.id,
            iconId: iconId
          }
        } as DeleteParticipantIconMutationVariables
      })
    },
    [deleteIcon]
  )

  return (
    <div>
      アイコン
      <div className='mb-1 flex'>
        {icons.length === 0 && <p>アイコンが登録されていません。</p>}
        {icons.length > 0 &&
          icons.map((icon) => (
            <div className='relative flex' key={icon.id}>
              <Image
                className='block w-full'
                src={icon.url}
                width={60}
                height={60}
                alt='プロフィール画像'
              />
              {canEdit && (
                <button
                  className='absolute right-0 top-0'
                  onClick={() => handleDelete(icon.id)}
                >
                  <TrashIcon className='h-4 w-4 bg-red-500 text-white' />
                </button>
              )}
            </div>
          ))}
      </div>
    </div>
  )
}
