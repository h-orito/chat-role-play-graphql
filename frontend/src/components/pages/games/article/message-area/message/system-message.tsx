import { Message } from '@/lib/generated/graphql'
import MessageText from '../message-text/message-text'

type Props = {
  message: Message
}

export default function SystemMessage({ message }: Props) {
  return (
    <div>
      <div className='w-full p-4'>
        <div className='flex'>
          <div className='flex-1 text-sm'>
            <div className='min-h-[60px] w-full whitespace-pre-wrap break-words rounded border border-gray-300  p-2 text-gray-700'>
              <MessageText
                rawText={message.content.text}
                isConvertDisabled={message.content.isConvertDisabled}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
