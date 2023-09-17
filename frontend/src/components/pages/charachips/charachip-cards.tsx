import { base64ToId } from '@/components/graphql/convert'
import { Charachip } from '@/lib/generated/graphql'
import Link from 'next/link'
import Image from 'next/image'

type Props = {
  charachips: Array<Charachip>
}
export default function CharachipCards({ charachips }: Props) {
  return (
    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
      {charachips.map((c) => (
        <CharachipCard key={c.id} charachip={c} />
      ))}
    </div>
  )
}

const CharachipCard = ({ charachip }: { charachip: Charachip }) => {
  return (
    <Link href={`/charachips/${base64ToId(charachip.id)}`} className='relative'>
      <div className='base-border flex flex-col rounded-lg border hover:border-blue-500'>
        <div className='w-full rounded-t-lg p-4'>
          <div className='flex justify-center gap-2'>
            {charachip.charas.map((chara) => (
              <Image
                src={chara.images[0].url}
                width={chara.size.width}
                height={chara.size.height}
                alt='キャラアイコン'
              />
            ))}
          </div>
        </div>
        <div className='flex-1'>
          <div className='px-4 py-2'>
            <p className='text-center text-xs'>
              {charachip.name}（{charachip.designer.name}様）
            </p>
          </div>
        </div>
      </div>
    </Link>
  )
}
