import { Game, Message, Messages } from '@/lib/generated/graphql'
import MessageComponent from './message/message'
import Paging from './paging'

type MessageAreaProps = {
  game: Game
  messages: Messages
}

export default function MessageArea({ game, messages }: MessageAreaProps) {
  return (
    <div className='flex flex-1 flex-col'>
      <Paging messages={messages} />
      <div className='flex-1 overflow-y-auto'>
        {messages.list.map((message: Message) => (
          <MessageComponent message={message} key={message.id} />
        ))}
      </div>
      <Paging messages={messages} />
    </div>
  )
}
