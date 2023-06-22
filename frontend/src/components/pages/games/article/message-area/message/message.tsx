import { Message } from '@/lib/generated/graphql'
import Image from 'next/image'
import {
  StarIcon,
  ChatBubbleOvalLeftEllipsisIcon
} from '@heroicons/react/24/outline'
import { iso2display } from '@/components/util/datetime/datetime'

type MessageProps = {
  message: Message
}

export default function MessageComponent({ message }: MessageProps) {
  return (
    <div className='w-full border-t border-gray-300 p-4'>
      {message.sender && (
        <div className='flex pb-1'>
          <p className='text-xs'>{message.sender.charaName}</p>
          <p className='ml-auto self-end text-xs text-gray-500'>
            {iso2display(message.time.sendAt)}
          </p>
        </div>
      )}
      <div className='flex'>
        {message.sender && (
          <div>
            <Image
              src={message.sender.charaImage.url}
              width={message.sender.charaImage.size.width}
              height={message.sender.charaImage.size.height}
              alt='キャラアイコン'
            />
          </div>
        )}
        <div className='ml-2 flex-1 text-sm'>
          <div className='min-h-[60px] w-full whitespace-pre-wrap break-words rounded border border-gray-300 p-2 text-gray-700'>
            {message.content.text}
          </div>
          <div className='flex pt-1'>
            <div className='flex flex-1'>
              <ChatBubbleOvalLeftEllipsisIcon className='y-6 h-6 text-gray-500' />
              {message.reactions.replyCount > 0 && (
                <p className='ml-1 self-center text-gray-500'>
                  {message.reactions.replyCount}
                </p>
              )}
            </div>
            <div className='flex flex-1'>
              <StarIcon className='y-6 h-6 text-gray-500' />
              {message.reactions.favoriteCount > 0 && (
                <p className='ml-1 self-center text-gray-500'>
                  {message.reactions.favoriteCount}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
