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
  Game,
  GameDocument,
  GameQuery,
  GameQueryVariables
} from '@/lib/generated/graphql'
import { ReactElement, useRef, useState } from 'react'
import { useUserDisplaySettings } from '@/components/pages/games/user-settings'
import { Theme, convertThemeToCSS, themeMap } from '@/components/theme/theme'
import Layout from '@/components/layout/layout'
import RatingWarningModal from '@/components/pages/games/rating-warning-modal'
import {
  useGame,
  useGameValue,
  useMyPlayer,
  useMyself,
  usePollingPeriod
} from '@/components/pages/games_new/game-hook'

export const getServerSideProps = async (context: any) => {
  const { gameId } = context.params
  const client = createInnerClient()
  const gameStringId = idToBase64(gameId, 'Game')
  const { data: gamedata } = await client.query<GameQuery>({
    query: GameDocument,
    variables: { id: gameStringId } as GameQueryVariables
  })
  return {
    props: {
      gameId: gameStringId,
      game: gamedata.game as Game
    }
  }
}

type Props = {
  game: Game
}

const GamePage = ({ game }: Props) => {
  useGame(game)
  useMyself(game.id)
  useMyPlayer()

  // 1分に1回ゲーム更新チェック
  usePollingPeriod(game)

  const [isOpenProfileModal, setIsOpenProfileModal] = useState(false)
  const toggleProfileModal = (e: any) => {
    setIsOpenProfileModal(!isOpenProfileModal)
  }
  const [profileParticipantId, setProfileParticipantId] = useState<string>('')
  const openProfileModal = async (participantId: string) => {
    setProfileParticipantId(participantId)
    setIsOpenProfileModal(true)
  }

  const articleRef = useRef({} as ArticleRefHandle)
  const fetchHomeLatest = async () => {
    await articleRef.current.fetchHomeLatest()
  }

  return (
    <>
      <main className='flex w-full'>
        <Head>
          <title>{game.name}</title>
        </Head>
        <Sidebar
          openProfileModal={openProfileModal}
          fetchHomeLatest={fetchHomeLatest}
        />
        <Article ref={articleRef} openProfileModal={openProfileModal} />
        {isOpenProfileModal && (
          <ArticleModal
            header={
              game.participants.find((p) => p.id === profileParticipantId)?.name
            }
            close={toggleProfileModal}
            hideFooter
          >
            <Profile
              participantId={profileParticipantId}
              close={toggleProfileModal}
            />
          </ArticleModal>
        )}
        <RatingWarningModal />
      </main>
      <ThemeCSS />
    </>
  )
}

GamePage.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>
}

export default GamePage

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

  return (
    <style jsx global>
      {css}
    </style>
  )
}
