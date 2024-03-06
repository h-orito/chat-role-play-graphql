import Head from 'next/head'
import { createInnerClient } from '@/components/graphql/client'
import { idToBase64 } from '@/components/graphql/convert'
import {
  FollowDocument,
  FollowMutation,
  FollowMutationVariables,
  Game,
  GameDocument,
  GameParticipantIcon,
  GameParticipantProfile,
  GameParticipantProfileDocument,
  GameParticipantProfileQuery,
  GameQuery,
  GameQueryVariables,
  IconsDocument,
  IconsQuery,
  LeaveDocument,
  LeaveMutation,
  LeaveMutationVariables,
  UnfollowDocument,
  UnfollowMutation,
  UnfollowMutationVariables
} from '@/lib/generated/graphql'
import { ReactElement, memo, useCallback, useState } from 'react'
import { useUserDisplaySettings } from '@/components/pages/games/user-settings'
import { Theme, convertThemeToCSS, themeMap } from '@/components/theme/theme'
import Layout from '@/components/layout/layout'
import {
  useGame,
  useGameValue,
  useMyself,
  useMyselfInit
} from '@/components/pages/games/game-hook'
import DangerButton from '@/components/button/danger-button'
import PrimaryButton from '@/components/button/primary-button'
import Modal from '@/components/modal/modal'
import MessageText from '@/components/pages/games/article/message-area/message-text/message-text'
import FollowersCount from '@/components/pages/games/profile/followers-count'
import FollowsCount from '@/components/pages/games/profile/follows-count'
import ParticipantIcons from '@/components/pages/games/profile/participant-icons'
import ProfileEdit from '@/components/pages/games/profile/profile-edit'
import { useLazyQuery, useMutation } from '@apollo/client'

export const getServerSideProps = async (context: any) => {
  const { gameId, participantId } = context.params
  const client = createInnerClient()
  // game
  const gameStringId = idToBase64(gameId, 'Game')
  const { data: gamedata } = await client.query<GameQuery>({
    query: GameDocument,
    variables: { id: gameStringId } as GameQueryVariables
  })
  // profile
  const participantStringId = idToBase64(participantId, 'GameParticipant')
  const { data: profiledata } = await client.query<GameParticipantProfileQuery>(
    {
      query: GameParticipantProfileDocument,
      variables: { participantId: participantStringId }
    }
  )
  // icons
  const { data: icondata } = await client.query<IconsQuery>({
    query: IconsDocument,
    variables: { participantId: participantStringId }
  })

  return {
    props: {
      game: gamedata.game as Game,
      profile: profiledata.gameParticipantProfile as GameParticipantProfile,
      icons: icondata.gameParticipantIcons as Array<GameParticipantIcon>
    }
  }
}

type Props = {
  game: Game
  profile: GameParticipantProfile
  icons: Array<GameParticipantIcon>
}

const GameParticipantProfilePage = ({
  game,
  profile: initialProfile,
  icons: initialIcons
}: Props) => {
  useGame(game)
  const myself = useMyselfInit(game.id)
  const [profile, setProfile] = useState<GameParticipantProfile>(initialProfile)
  const [icons, setIcons] = useState<Array<GameParticipantIcon>>(initialIcons)

  const isMyself = myself?.id === profile.participantId
  const canEdit =
    isMyself &&
    ['Closed', 'Opening', 'Recruiting', 'Progress', 'Epilogue'].includes(
      game.status
    )

  const [fetchProfile] = useLazyQuery<GameParticipantProfileQuery>(
    GameParticipantProfileDocument
  )
  const [fetchIcons] = useLazyQuery<IconsQuery>(IconsDocument)

  const refetchProfile = useCallback(async () => {
    const { data } = await fetchProfile({
      variables: { participantId: profile.participantId }
    })
    if (data?.gameParticipantProfile == null) return
    setProfile(data.gameParticipantProfile)
  }, [profile.participantId, fetchProfile])

  const refetchIcons = async (): Promise<Array<GameParticipantIcon>> => {
    const { data } = await fetchIcons({
      variables: { participantId: profile.participantId }
    })
    if (data?.gameParticipantIcons == null) return []
    setIcons(data.gameParticipantIcons as Array<GameParticipantIcon>)
    return data.gameParticipantIcons as Array<GameParticipantIcon>
  }

  return (
    <>
      <main className='w-full'>
        <Head>
          <title>
            {game.name} | ENo{profile.entryNumber}.&nbsp;{profile.name}
          </title>
        </Head>
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
                  profile={profile}
                  refetchProfile={refetchProfile}
                  canEdit={canEdit}
                  icons={icons}
                />
              </div>
              <PlayerName profile={profile} />
              {profile.introduction && (
                <p className='my-2 whitespace-pre-wrap break-words rounded-md bg-gray-100 p-4 text-gray-700'>
                  <MessageText rawText={profile.introduction} />
                </p>
              )}
              {isMyself && (
                <div>
                  <FollowsCount profile={profile} />
                  &nbsp;&nbsp;
                  <FollowersCount profile={profile} />
                </div>
              )}
              <ParticipantIcons
                icons={icons}
                canEdit={canEdit}
                refetchIcons={refetchIcons}
              />
            </div>
          </div>
          {canEdit && <LeaveButton />}
        </div>
      </main>
      <ThemeCSS />
    </>
  )
}

GameParticipantProfilePage.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>
}

export default GameParticipantProfilePage

const ThemeCSS = () => {
  const game = useGameValue()
  const [displaySettings] = useUserDisplaySettings()
  const themeName = displaySettings.themeName
  let theme: Theme
  if (themeName === 'original') {
    if (game.settings.rule.theme != null && game.settings.rule.theme !== '') {
      theme = JSON.parse(game.settings.rule.theme)
    } else {
      theme = themeMap.get('light')!
    }
  } else {
    theme = themeMap.get(themeName)!
  }

  const css = convertThemeToCSS(theme)
  return <style jsx>{css}</style>
}

const LeaveButton = () => {
  const game = useGameValue()
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

const PlayerName = ({ profile }: { profile: GameParticipantProfile }) => {
  const game = useGameValue()
  const shouldShowPlayer =
    ['Epilogue', 'Finished', 'Cancelled'].includes(game.status) ||
    profile?.isPlayerOpen == true

  if (!shouldShowPlayer) return <></>

  return (
    <p className='secondary-text text-xs font-normal'>
      PL: {profile.playerName}
    </p>
  )
}

type FFButtonsProps = {
  refetchProfile: () => void
  profile: GameParticipantProfile
  canEdit: boolean
  icons: Array<GameParticipantIcon>
}

const FFButtons = ({
  refetchProfile,
  profile,
  canEdit,
  icons
}: FFButtonsProps) => {
  return (
    <div className='ml-auto'>
      <FollowButton
        participantId={profile.participantId}
        profile={profile}
        refetchProfile={refetchProfile}
      />
      <UnfollowButton
        participantId={profile.participantId}
        profile={profile}
        refetchProfile={refetchProfile}
      />
      <ProfileEditButton
        canEdit={canEdit}
        profile={profile}
        icons={icons}
        refetchProfile={refetchProfile}
      />
    </div>
  )
}

type ProfileEditButtonProps = {
  canEdit: boolean
  profile: GameParticipantProfile
  icons: Array<GameParticipantIcon>
  refetchProfile: () => void
}
const ProfileEditButton = (props: ProfileEditButtonProps) => {
  const { canEdit, profile, icons, refetchProfile } = props
  const [isOpenEditModal, setIsOpenEditModal] = useState(false)
  const toggleEditModal = (e: any) => {
    if (e.target === e.currentTarget) {
      setIsOpenEditModal(!isOpenEditModal)
    }
  }

  if (!canEdit) return <></>
  return (
    <>
      <PrimaryButton click={() => setIsOpenEditModal(true)}>
        プロフィール編集
      </PrimaryButton>
      {isOpenEditModal && (
        <Modal header='プロフィール編集' close={toggleEditModal} hideFooter>
          <ProfileEdit
            profile={profile}
            icons={icons}
            refetchProfile={refetchProfile}
            close={toggleEditModal}
          />
        </Modal>
      )}
    </>
  )
}

type FollowButtonProps = {
  participantId: string
  profile: GameParticipantProfile
  refetchProfile: () => void
}

const FollowButton = ({
  participantId,
  profile,
  refetchProfile
}: FollowButtonProps) => {
  const game = useGameValue()
  const [myself, refetchMyself] = useMyself(game.id)
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
  participantId: string
  profile: GameParticipantProfile
  refetchProfile: () => void
}

const UnfollowButton = ({
  participantId,
  profile,
  refetchProfile
}: UnfollowButtonProps) => {
  const game = useGameValue()
  const [myself, refetchMyself] = useMyself(game.id)
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
