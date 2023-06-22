import DangerButton from '@/components/button/danger-button'
import PrimaryButton from '@/components/button/primary-button'
import WarnButton from '@/components/button/warn-button'
import { Game } from '@/lib/generated/graphql'
import Image from 'next/image'

type TalkAreaProps = {
  game: Game
}

export default function TalkArea({ game }: TalkAreaProps) {
  return (
    <div className='px-4 py-2'>
      <div className='flex pb-1'>
        <p>なまえ</p>
      </div>
      <div className='flex'>
        <div>
          <Image
            src={'https://placehold.jp/120x120.png'}
            width={60}
            height={60}
            alt='キャラアイコン'
          />
        </div>
        <div className='ml-2 flex-1'>
          <textarea
            name='dummy'
            id='dummy'
            cols={20}
            className=' w-full rounded border border-gray-300 p-2'
          ></textarea>
        </div>
      </div>
      <div className='flex justify-end'>
        <PrimaryButton click={(e: any) => console.log('TODO')}>
          送信
        </PrimaryButton>
      </div>
    </div>
  )
}
