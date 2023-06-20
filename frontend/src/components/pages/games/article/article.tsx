import { Game } from '@/lib/generated/graphql'
import ArticleHeader from './article-header'

type ArticleProps = {
  game: Game
}

export default function Article({ game }: ArticleProps) {
  return (
    <article className='flex flex-1 flex-col'>
      <ArticleHeader />
      <div className='flex-1 overflow-y-auto'>
        <p>発言1</p>
        <p>発言2</p>
      </div>
    </article>
  )
}
