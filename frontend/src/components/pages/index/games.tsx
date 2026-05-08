import Link from 'next/link'
import {
  base64ToId,
  convertToGameStatusName
} from '@/components/graphql/convert'
import { GameLabel, SimpleGame } from '@/lib/generated/graphql'
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
  const descriptions: Array<{ key: string; text: string }> = []
  descriptions.push({
    key: 'status',
    text: `状態: ${convertToGameStatusName(game.status)}`
  })
  descriptions.push({
    key: 'participants',
    text: `参加人数: ${game.participantsCount}人`
  })
  switch (game.status) {
    case 'Closed':
      descriptions.push({
        key: 'time',
        text: `公開開始: ${iso2display(game.settings.time.openAt)}`
      })
      break
    case 'Opening':
      descriptions.push({
        key: 'time',
        text: `登録開始: ${iso2display(game.settings.time.startParticipateAt)}`
      })
      break
    case 'Recruiting':
      descriptions.push({
        key: 'time',
        text: `ゲーム開始: ${iso2display(game.settings.time.startGameAt)}`
      })
      break
    case 'Progress':
      const epilogueAt = game.settings.time.epilogueGameAt
      const periodEndAt = game.periods[game.periods.length - 1].endAt
      if (epilogueAt < periodEndAt) {
        descriptions.push({
          key: 'time',
          text: `エピローグ開始: ${iso2display(epilogueAt)}`
        })
      } else {
        descriptions.push({
          key: 'time',
          text: `次回更新: ${iso2display(periodEndAt)}`
        })
      }
      break
    case 'Epilogue':
      descriptions.push({
        key: 'time',
        text: `ゲーム終了: ${iso2display(game.settings.time.finishGameAt)}`
      })
      break
    default:
      break
  }

  const gameImage =
    game.settings.background.catchImageUrl != null &&
    game.settings.background.catchImageUrl.length > 0
      ? game.settings.background.catchImageUrl
      : '/chat-role-play/images/game.jpg'

  return (
    <Link href={`/games/${base64ToId(game.id)}`} className='relative'>
      <div className='flex flex-col rounded-lg border border-gray-300 hover:border-blue-500'>
        <div
          className='h-60 w-full rounded-t-lg bg-cover bg-center bg-no-repeat p-4'
          style={{
            backgroundImage: `url(${gameImage})`
          }}
        ></div>
        <div className='flex-1'>
          <div className='border-b border-gray-300 px-4 py-2'>
            <p className='text-left'>{game.name}</p>
          </div>
          <div className='px-4 py-2 text-left text-xs leading-6'>
            <div className='flex'>
              {game.labels.map((l: GameLabel) => (
                <Label key={l.id} label={l} />
              ))}
            </div>
            <div className='mt-2'>
              {descriptions.map((d) => (
                <p key={d.key}>{d.text}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

const Label = ({ label }: { label: GameLabel }) => {
  const colorClass =
    label.type === 'success'
      ? 'bg-green-500'
      : label.type === 'danger'
      ? 'bg-red-500'
      : 'bg-gray-500'
  return (
    <span className={`mr-1 rounded-sm px-2 text-white ${colorClass}`}>
      {label.name}
    </span>
  )
}
