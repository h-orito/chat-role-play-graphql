import {
  Game,
  GameDocument,
  GameQuery,
  GameQueryVariables
} from '@/lib/generated/graphql'
import { useQuery } from '@apollo/client'
import { ReactNode, createContext, useContext } from 'react'

const GameContext = createContext<Game | null>(null)

type Props = {
  game: Game
  children: ReactNode
}

// 1分に1回 game を再取得し、参加者・期間・ステータスなどの変更を反映する。
const GAME_POLL_INTERVAL_MS = 60_000

export const GameProvider = ({ game: initialGame, children }: Props) => {
  const { data } = useQuery<GameQuery, GameQueryVariables>(GameDocument, {
    variables: { id: initialGame.id },
    pollInterval: GAME_POLL_INTERVAL_MS
  })
  const game = (data?.game as Game | undefined) ?? initialGame
  return <GameContext.Provider value={game}>{children}</GameContext.Provider>
}

export const useGameValue = (): Game => {
  const game = useContext(GameContext)
  if (!game) {
    throw new Error('useGameValue must be used within GameProvider')
  }
  return game
}
