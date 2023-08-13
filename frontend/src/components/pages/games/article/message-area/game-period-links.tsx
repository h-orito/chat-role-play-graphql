import { Game } from '@/lib/generated/graphql'

type Props = {
  game: Game
  periodId: string | undefined | null
  setQuery: (periodId: string) => void
}

export default function GamePeriodLinks({ game, periodId, setQuery }: Props) {
  return (
    <div className='border-b border-gray-300 p-2 text-center text-xs'>
      {game.periods.map((period) => {
        return (
          <span key={period.id} className='ml-2 first:ml-0'>
            {periodId === period.id ? (
              <strong>{period.name}</strong>
            ) : (
              <button
                className='hover:text-blue-500'
                onClick={() => setQuery(period.id)}
              >
                {period.name}
              </button>
            )}
          </span>
        )
      })}
    </div>
  )
}
