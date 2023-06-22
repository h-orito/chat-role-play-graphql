import { Game, Messages } from '@/lib/generated/graphql'
import ArticleHeader from './article-header'
import TalkArea from './talk-area/talk-area'
import MessageArea from './message-area/message-area'

type ArticleProps = {
  game: Game
  messages: Messages
}

export default function Article({ game, messages }: ArticleProps) {
  return (
    <article className='flex h-screen flex-1 flex-col'>
      <ArticleHeader />
      <TalkArea game={game} />
      <MessageArea game={game} messages={messages} />
    </article>
  )
}
