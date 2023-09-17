import { Chara, Charachip } from '@/lib/generated/graphql'
import Image from 'next/image'

type Props = {
  charachip: Charachip
}
export default function CharaCards({ charachip }: Props) {
  return (
    <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
      {charachip.charas.map((c) => (
        <CharaCard key={c.id} chara={c} />
      ))}
    </div>
  )
}

const CharaCard = ({ chara }: { chara: Chara }) => {
  return (
    <div className='base-border flex flex-col rounded-lg border'>
      <div className='w-full rounded-t-lg p-4'>
        <div className='flex justify-center gap-2'>
          {chara.images.map((image) => (
            <Image
              src={image.url}
              width={chara.size.width}
              height={chara.size.height}
              alt='キャラアイコン'
            />
          ))}
        </div>
      </div>
      <div className='flex-1'>
        <div className='px-4 py-2'>
          <p className='text-center text-xs'>{chara.name}</p>
        </div>
      </div>
    </div>
  )
}
