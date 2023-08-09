import Link from 'next/link'
import {
  base64ToId,
  convertToGameStatusName
} from '@/components/graphql/convert'
import { SimpleGame } from '@/lib/generated/graphql'
import { iso2display } from '@/components/util/datetime/datetime'

type Props = {
  games: SimpleGame[]
}

export default function Games({ games }: Props) {
  return (
    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
      {games.map((g) => (
        <GameCard key={g.id} game={g}></GameCard>
      ))}
    </div>
  )
}

const GameCard = ({ game }: { game: SimpleGame }) => {
  const descriptions = []
  descriptions.push(`状態: ${convertToGameStatusName(game.status)}`)
  descriptions.push(`参加人数: ${game.participantsCount}人`)
  switch (game.status) {
    case 'Closed':
      descriptions.push(`公開開始: ${iso2display(game.settings.time.openAt)}`)
      break
    case 'Opening':
      descriptions.push(
        `参加者募集開始: ${iso2display(game.settings.time.startParticipateAt)}`
      )
      break
    case 'Recruiting':
      descriptions.push(
        `ゲーム開始: ${iso2display(game.settings.time.startGameAt)}`
      )
      break
    case 'Progress':
      descriptions.push(
        `次回更新: ${iso2display(game.periods[game.periods.length - 1].endAt)}`
      )
      break
    default:
      break
  }

  // TODO: ゲーム画像を設定できるようにする
  const gameImage = '/chat-role-play/images/game.jpg'

  return (
    <Link href={`/games/${base64ToId(game.id)}`} className='relative'>
      <div className='flex flex-col rounded-lg border border-gray-300 hover:border-blue-500'>
        <div
          className='h-60 w-full rounded-t-lg bg-cover bg-no-repeat p-4'
          style={{
            backgroundImage: `url(${gameImage})`
          }}
        ></div>
        <div className='flex-1'>
          <div className='border-b border-gray-300 px-4 py-2'>
            <p className='text-left'>{game.name}</p>
          </div>
          <div className='px-4 py-2 text-left text-xs leading-6'>
            {descriptions.map((d, idx) => (
              <p key={idx}>{d}</p>
            ))}
          </div>
        </div>
      </div>
    </Link>
  )
}