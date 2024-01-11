import { Message } from '@/lib/generated/graphql'
import MessageText from '../../../message-text/message-text'

type Props = {
  message: Message
}

export default function SystemMessage({ message }: Props) {
  const messageClass =
    message.content.type === 'SystemPublic' ? 'system-public' : ''
  return (
    <div>
      <div className='w-full px-4 py-2'>
        <div className='flex'>
          <div className='flex-1 text-sm'>
            <div className={`message min-h-[60px] ${messageClass}`}>
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
