import Head from 'next/head'
import { createInnerClient } from '@/components/graphql/client'
import { idToBase64 } from '@/components/graphql/convert'
import {
  Game,
  GameDocument,
  GameQuery,
  GameQueryVariables,
  Message,
  ThreadMessagesDocument,
  ThreadMessagesQuery
} from '@/lib/generated/graphql'
import { ReactElement } from 'react'
import { useUserDisplaySettings } from '@/components/pages/games/user-settings'
import { Theme, convertThemeToCSS, themeMap } from '@/components/theme/theme'
import Layout from '@/components/layout/layout'
import {
  useGame,
  useGameValue,
  useIcons,
  useMyPlayer,
  useMyself,
  useUserDisplaySettingsAtom
} from '@/components/pages/games/game-hook'
import ThreadMessageArea from '@/components/pages/games/thread/thread-message-area'

export const getServerSideProps = async (context: any) => {
  const { gameId, messageId } = context.params
  const client = createInnerClient()
  // game
  const gameStringId = idToBase64(gameId, 'Game')
  const { data: gamedata } = await client.query<GameQuery>({
    query: GameDocument,
    variables: { id: gameStringId } as GameQueryVariables
  })
  // thread messages
  const messageStringId = idToBase64(messageId, 'Message')
  const { data: threadMessageData } = await client.query<ThreadMessagesQuery>({
    query: ThreadMessagesDocument,
    variables: {
      gameId: gameStringId,
      messageId: messageStringId
    }
  })

  return {
    props: {
      game: gamedata.game as Game,
      messageId: messageStringId,
      threadMessages: threadMessageData.threadMessages as Array<Message>
    }
  }
}

type Props = {
  game: Game
  messageId: string
  threadMessages: Array<Message>
}

const GameParticipantProfilePage = ({
  game,
  messageId,
  threadMessages
}: Props) => {
  useGame(game)
  const [myself] = useMyself(game.id)
  useMyPlayer()
  useIcons()
  useUserDisplaySettingsAtom()

  return (
    <>
      <main className='w-full'>
        <Head>
          <title>{game.name}</title>
        </Head>
        <ThreadMessageArea
          game={game}
          messageId={messageId}
          threadMessages={threadMessages}
        />
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
