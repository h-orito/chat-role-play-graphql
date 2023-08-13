import { Game } from '@/lib/generated/graphql'

type Props = {
  game: Game
  periodId: string | undefined | null
  setQuery: (periodId: string) => void
}

export default function GamePeriodLinks({ game, periodId, setQuery }: Props) {
  return (
    <div className='flex justify-center border-b border-gray-300'>
      <ul className='flex py-2 text-xs'>
        {game.periods.map((period) => {
          return (
            <li className='mx-1' key={period.id}>
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
            </li>
          )
        })}
      </ul>
    </div>
  )
}
