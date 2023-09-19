import Head from 'next/head'
import { createInnerClient } from '@/components/graphql/client'
import { idToBase64 } from '@/components/graphql/convert'
import ArticleModal from '@/components/modal/article-modal'
import Article, {
  ArticleRefHandle
} from '@/components/pages/games/article/article'
import Profile from '@/components/pages/games/profile/profile'
import Sidebar from '@/components/pages/games/sidebar/sidebar'
import {
  ChangePeriod,
  ChangePeriodDocument,
  ChangePeriodMutation,
  ChangePeriodMutationVariables,
  Game,
  GameDocument,
  GameParticipant,
  GameQuery,
  GameQueryVariables,
  MyGameParticipantDocument,
  MyGameParticipantQuery,
  MyGameParticipantQueryVariables,
  MyPlayerDocument,
  MyPlayerQuery,
  Player
} from '@/lib/generated/graphql'
import { useLazyQuery, useMutation } from '@apollo/client'
import { ReactElement, useEffect, useRef, useState } from 'react'
import { useCookies } from 'react-cookie'
import Modal from '@/components/modal/modal'
import SecondaryButton from '@/components/button/scondary-button'
import { useRouter } from 'next/router'
import PrimaryButton from '@/components/button/primary-button'
import { useUserDisplaySettings } from '@/components/pages/games/user-settings'
import { Theme, convertThemeToCSS, themeMap } from '@/components/theme/theme'
import Layout from '@/components/layout/layout'

export const getServerSideProps = async (context: any) => {
  const { id } = context.params
  const client = createInnerClient()
  const gameId = idToBase64(id, 'Game')
  const { data: gamedata } = await client.query<GameQuery>({
    query: GameDocument,
    variables: { id: gameId } as GameQueryVariables
  })
  return {
    props: {
      gameId: id,
      game: gamedata.game as Game
    }
  }
}

type Props = {
  game: Game
}

const GamePage = ({ game }: Props) => {
  const [loading, setLoading] = useState(false)
  const [myself, setMyself] = useState<GameParticipant | null>(null)
  const [myPlayer, setMyPlayer] = useState<Player | null>(null)

  const [fetchMyself] = useLazyQuery<MyGameParticipantQuery>(
    MyGameParticipantDocument
  )
  const refetchMyself = async () => {
    const { data } = await fetchMyself({
      variables: { gameId: game.id } as MyGameParticipantQueryVariables
    })
    if (data?.myGameParticipant == null) setMyself(null)
    else setMyself(data.myGameParticipant as GameParticipant)
  }

  const [fetchMyPlayer] = useLazyQuery<MyPlayerQuery>(MyPlayerDocument)
  const refetchMyPlayer = async () => {
    const { data } = await fetchMyPlayer()
    if (data?.myPlayer == null) return
    setMyPlayer(data.myPlayer as Player)
  }

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      await refetchMyself()
      await refetchMyPlayer()
      setLoading(false)
    }
    fetch()
  }, [])

  const [isOpenProfileModal, setIsOpenProfileModal] = useState(false)
  const toggleProfileModal = (e: any) => {
    setIsOpenProfileModal(!isOpenProfileModal)
  }
  const [profileParticipantId, setProfileParticipantId] = useState<string>('')
  const openProfileModal = async (participantId: string) => {
    setProfileParticipantId(participantId)
    setIsOpenProfileModal(true)
  }

  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const toggleSidebar = (e: any) => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  // 1分に1回ゲーム更新チェック
  const usePollingPeriod = (callback: () => void) => {
    const ref = useRef<() => void>(callback)
    useEffect(() => {
      ref.current = callback
    }, [callback])

    useEffect(() => {
      const mutation = () => {
        ref.current()
      }
      mutation() // 初回だけ即時実行
      const timer = setInterval(mutation, 60000)
      return () => clearInterval(timer)
    }, [])
  }
  const [changePeriod] = useMutation<ChangePeriodMutation>(
    ChangePeriodDocument,
    {
      onCompleted(e) {},
      onError(error) {
        console.error(error)
      }
    }
  )
  const changePeriodIfNeeded = async () => {
    if (!['Closed', 'Opening', 'Recruiting', 'Progress'].includes(game.status))
      return
    await changePeriod({
      variables: {
        input: {
          gameId: game.id
        } as ChangePeriod
      } as ChangePeriodMutationVariables
    })
  }
  usePollingPeriod(() => changePeriodIfNeeded())

  const articleRef = useRef({} as ArticleRefHandle)
  const fetchHomeLatest = async () => {
    await articleRef.current.fetchHomeLatest()
  }

  if (loading) return <div>loading...</div>
  return (
    <>
      <main className='flex w-full'>
        <Head>
          <title>{game.name}</title>
        </Head>
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          game={game}
          myself={myself}
          myPlayer={myPlayer}
          openProfileModal={openProfileModal}
          fetchHomeLatest={fetchHomeLatest}
        />
        <Article
          ref={articleRef}
          game={game}
          myself={myself}
          openProfileModal={openProfileModal}
          toggleSidebar={toggleSidebar}
        />
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
        <RatingWarningModal game={game} />
      </main>
      <ThemeCSS game={game} />
    </>
  )
}

GamePage.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>
}

export default GamePage

const RatingWarningModal = ({ game }: { game: Game }) => {
  const [getCookie, setCookie] = useCookies()
  const rating = game.labels.find((l) =>
    ['R15', 'R18', 'R18G'].includes(l.name)
  )
  const ratingCookie: RatingCookie = getCookie['rating'] || {}
  const alreadyConfiemed = !!ratingCookie && ratingCookie[game.id] === true
  const shouldShowRatingWarning = !!rating && !alreadyConfiemed
  const [showModal, setShowModal] = useState(true)
  const router = useRouter()
  const handleShow = () => {
    ratingCookie[game.id] = true
    setCookie('rating', ratingCookie, {
      path: '/chat-role-play',
      maxAge: 60 * 60 * 24 * 365
    })
    setShowModal(false)
  }

  if (!shouldShowRatingWarning) return <></>

  return (
    <>
      {showModal && (
        <Modal
          header='年齢制限確認'
          close={() => setShowModal(false)}
          hideFooter={true}
          hideOnClickOutside={false}
        >
          <div>
            <p>
              この村は年齢制限が{' '}
              <span className='danger-text text-lg'>
                <strong>{rating.name}</strong>
              </span>{' '}
              に設定されており、
              <br />
              暴力表現や性描写などが含まれる可能性があります。
            </p>
            <div className='flex justify-end'>
              <SecondaryButton className='mr-2' click={() => router.push('/')}>
                表示せず戻る
              </SecondaryButton>
              <PrimaryButton click={() => handleShow()}>表示する</PrimaryButton>
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}

type RatingCookie = {
  [gameId: string]: boolean
}

const ThemeCSS = ({ game }: { game: Game }) => {
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

  return (
    <style jsx global>
      {css}
    </style>
  )
}
