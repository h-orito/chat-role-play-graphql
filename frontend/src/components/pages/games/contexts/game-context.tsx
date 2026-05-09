import { Game } from '@/lib/generated/graphql'
import { ReactNode, createContext, useContext } from 'react'

const GameContext = createContext<Game | null>(null)

type Props = {
  game: Game
  children: ReactNode
}

export const GameProvider = ({ game, children }: Props) => (
  <GameContext.Provider value={game}>{children}</GameContext.Provider>
)

export const useGameValue = (): Game => {
  const game = useContext(GameContext)
  if (!game) {
    throw new Error('useGameValue must be used within GameProvider')
  }
  return game
}
