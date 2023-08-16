import { Chara, Game } from '@/lib/generated/graphql'
import Image from 'next/image'

type Props = {
  game: Game
  charas: Array<Chara>
  setValue: (value: string) => void
}

export default function CharaSelect({ game, charas, setValue }: Props) {
  const handleClick = (e: any, id: string) => {
    e.preventDefault()
    setValue(id)
  }
  const alreadyParticipateCharaIds = game.participants
    .map((p) => p.chara?.id)
    .filter((id) => id !== null)
  const candidates = charas.filter(
    (c) => !alreadyParticipateCharaIds.includes(c.id)
  )
  return (
    <div className='grid grid-cols-3 gap-4 md:grid-cols-4 lg:grid-cols-5'>
      {candidates.map((chara) => {
        return (
          <button
            key={chara.id}
            className={`rounded-md border p-2 hover:bg-gray-100`}
            onClick={(e: any) => handleClick(e, chara.id)}
          >
            <div className='flex justify-center'>
              <Image
                className='cursor-pointer'
                src={
                  chara.images.find((i) => i.type === 'NORMAL')?.url ??
                  chara.images[0].url
                }
                width={chara.size.width}
                height={chara.size.height}
                alt='キャラアイコン'
              />
            </div>
            <div>
              <p className='text-center text-xs'>{chara.name}</p>
            </div>
          </button>
        )
      })}
    </div>
  )
}
