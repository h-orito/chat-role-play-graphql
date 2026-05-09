import {
  Game,
  GameDocument,
  GameQuery,
  GameQueryVariables
} from '@/lib/generated/graphql'
import { useLazyQuery } from '@apollo/client'
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState
} from 'react'

const GameContext = createContext<Game | null>(null)

type Props = {
  game: Game
  children: ReactNode
}

// 1分に1回 game を再取得し、参加者・期間・ステータスなどの変更を反映する。
// useQuery を使うとマウント直後に SSR と同じ GameDocument を即時で再発行してしまうため、
// useLazyQuery + setInterval で初回 fetch も 60s 後にずらす。
const GAME_POLL_INTERVAL_MS = 60_000

export const GameProvider = ({ game: initialGame, children }: Props) => {
  const [game, setGame] = useState<Game>(initialGame)
  const [refetchGame] = useLazyQuery<GameQuery, GameQueryVariables>(
    GameDocument,
    { variables: { id: initialGame.id } }
  )

  useEffect(() => {
    const tick = async () => {
      const { data } = await refetchGame()
      if (data?.game) setGame(data.game as Game)
    }
    const timer = setInterval(tick, GAME_POLL_INTERVAL_MS)
    return () => clearInterval(timer)
  }, [refetchGame])

  return <GameContext.Provider value={game}>{children}</GameContext.Provider>
}

export const useGameValue = (): Game => {
  const game = useContext(GameContext)
  if (!game) {
    throw new Error('useGameValue must be used within GameProvider')
  }
  return game
}
