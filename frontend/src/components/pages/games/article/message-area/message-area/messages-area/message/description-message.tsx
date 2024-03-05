import { Message } from '@/lib/generated/graphql'
import MessageText from '../../../message-text/message-text'
import { iso2display } from '@/components/util/datetime/datetime'
import FavoriteButton from '@/components/pages/games/article/message-area/message-area/messages-area/message/favorite-button'
import { SenderName } from './sender-name'

type Props = {
  message: Message
  preview?: boolean
}

export default function DescriptionMessage({
  message,
  preview = false
}: Props) {
  return (
    <div>
      <div className='w-full px-4 py-2'>
        {message.sender && (
          <div className='flex pb-1'>
            <SenderName message={message} preview={preview} />
            <p className='secondary-text ml-auto self-end text-xs'>
              {iso2display(message.time.sendAt)}
            </p>
          </div>
        )}
        <div className='flex'>
          <div className='flex-1 text-sm'>
            <div className={`message description min-h-[60px]`}>
              <MessageText
                rawText={message.content.text}
                isConvertDisabled={message.content.isConvertDisabled}
              />
            </div>
          </div>
        </div>
        <div className='flex justify-end pt-1'>
          <FavoriteButton message={message} />
        </div>
      </div>
    </div>
  )
}
