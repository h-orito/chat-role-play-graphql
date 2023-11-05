import { Game } from '@/lib/generated/graphql'

type Props = {
  game: Game
  periodId: string | undefined | null
  setQuery: (periodId: string) => void
}

export default function GamePeriodLinks({ game, periodId, setQuery }: Props) {
  return (
    <div className='base-border border-b p-2 text-center text-xs'>
      {game.periods.map((period) => {
        return (
          <span key={period.id} className='ml-2 first:ml-0'>
            {periodId === period.id ? (
              <strong>{period.name}</strong>
            ) : (
              <button className='base-link' onClick={() => setQuery(period.id)}>
                {period.name}
              </button>
            )}
          </span>
        )
      })}
    </div>
  )
}
