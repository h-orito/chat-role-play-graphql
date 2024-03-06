import Head from 'next/head'
import { createInnerClient } from '@/components/graphql/client'
import { idToBase64 } from '@/components/graphql/convert'
import Article from '@/components/pages/games/article/article'
import Sidebar from '@/components/pages/games/sidebar/sidebar'
import {
  Game,
  GameDocument,
  GameQuery,
  GameQueryVariables,
  MessagesQuery
} from '@/lib/generated/graphql'
import { ReactElement } from 'react'
import { useUserDisplaySettings } from '@/components/pages/games/user-settings'
import { Theme, convertThemeToCSS, themeMap } from '@/components/theme/theme'
import Layout from '@/components/layout/layout'
import RatingWarningModal from '@/components/pages/games/rating-warning-modal'
import {
  useGame,
  useGameValue,
  useIcons,
  useMyPlayer,
  useMyselfInit,
  usePollingPeriod,
  useUserDisplaySettingsAtom
} from '@/components/pages/games/game-hook'
import {
  fromUrlQuery,
  useMessagesQuery
} from '@/components/pages/games/article/message-area/message-area/messages-query'

export const getServerSideProps = async (context: any) => {
  const { gameId } = context.params
  const client = createInnerClient()
  const gameStringId = idToBase64(gameId, 'Game')
  const { data: gamedata } = await client.query<GameQuery>({
    query: GameDocument,
    variables: { id: gameStringId } as GameQueryVariables
  })
  const game = gamedata.game as Game
  const messagesQuery = fromUrlQuery(context.query, game)
  return {
    props: {
      game: game,
      messagesQuery
    }
  }
}

type Props = {
  game: Game
  messagesQuery: MessagesQuery
}

const GamePage = ({ game, messagesQuery: initialMessagesQuery }: Props) => {
  useGame(game)
  useMyselfInit(game.id)
  useMyPlayer()
  useIcons()
  useUserDisplaySettingsAtom()
  // 検索用クエリ
  const [, setInitialMessagesQuery] = useMessagesQuery()
  setInitialMessagesQuery(initialMessagesQuery)
  // useSetInitialMessagesQuery(initialMessagesQuery)
  // 1分に1回ゲーム更新チェック
  usePollingPeriod(game)

  return (
    <>
      <main className='flex w-full'>
        <Head>
          <title>{game.name}</title>
        </Head>
        <Sidebar />
        <Article />
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
  return <style jsx>{css}</style>
}
